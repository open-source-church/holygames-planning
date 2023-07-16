<template>
  <q-page class="content column full-height" padding>
    <q-btn
      label="Activer"
      color="green"
      v-if="global.admin && !meta.active"
      @click="activate(true)"
    />
    <q-btn
      label="Désactiver"
      color="red"
      v-if="global.admin && meta.active"
      @click="activate(false)"
    />
    <h4 class="q-my-md text-center">Le Chevalier Holygames</h4>
    <q-banner class="bg-purple-2 q-ma-md" v-if="!meta.active">
      <template v-slot:avatar>
        <q-icon name="sym_o_swords" color="primary" />
      </template>
      Revenez ici pendant le ludiculte pour participer à créer le Chevalier
      Holygames !
    </q-banner>
    <div v-else>
      <div class="text-center q-mb-sm">
        <p v-if="my_votes.length" class="text-overline q-ma-none">
          Mes valeurs ({{ my_votes.length }} / 3):
        </p>
        <q-chip
          v-for="v in my_votes"
          dense
          :key="v.id"
          clickable
          color="primary"
          text-color="white"
          icon-right="close"
          :label="v.value"
          @click="unvote(v.id)"
        />
      </div>
      <q-list bordered separator>
        <q-linear-progress
          v-if="!realtime"
          size="1px"
          animation-speed="1000"
          :value="(now - last_update) / 5000"
        />
        <q-item
          clickable
          v-ripple
          v-for="v in realtime ? values : delayed_values"
          :key="v.name"
          @click="vote(v.name)"
        >
          <q-item-section side>
            <q-icon name="star" :color="v.active ? 'primary' : 'grey-4'" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-center">
              {{ v.name }}
              <span v-if="v.votes">
                <q-badge
                  color="grey-5"
                  :label="(v.percent * 100).toFixed() + '%'"
                />
                <q-badge
                  color="grey-5"
                  :label="v.votes + ' vote' + (v.votes > 1 ? 's' : '')"
                  class="q-ml-sm"
                />
              </span>
            </q-item-label>
            <q-linear-progress size="5px" :value="v.percent" class="q-mt-sm" />
          </q-item-section>
          <q-item-section side v-if="global.admin && v.votes">
            <q-btn flat dense icon="delete" @click.stop="delete_vote(v.name)" />
          </q-item-section>
        </q-item>
      </q-list>
      <div class="text-center q-ma-md">
        <q-btn
          label="Ajouter une valeur"
          color="green"
          icon="add"
          @click="add"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onUnmounted, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../supabase";
import { useGlobal } from "stores/global";
import { useQuasar } from "quasar";
import uuid from "uuid-random";

const realtime = computed(() => useRoute().params.realtime != "");

const global = useGlobal();
const $q = useQuasar();

/*
Channel Subscription
*/
// Add channel
const sub = supabase
  .channel("*")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "holygames-chevalier-2023-07" },
    (d) => {
      // Update
      if (d.eventType == "DELETE") {
        // remove d.old.id from values
        values_data.value = values_data.value.filter((v) => v.id != d.old.id);
      }
      if (d.eventType == "UPDATE") {
        // update d.new.id from values
        values_data.value = values_data.value.map((v) =>
          v.id == d.new.id ? d.new : v
        );
      }
      if (d.eventType == "INSERT") {
        // create / update d.new.id from values
        values_data.value.push(d.new);
      }
    }
  )
  .subscribe();

// Fetch
const values_data = ref([]);
const fetch = async () => {
  console.log("Getting data...");
  const { data } = await supabase.from("holygames-chevalier-2023-07").select();
  values_data.value = data;
  console.log("done");
};
fetch();

// Remove Channel
onUnmounted(() => {
  supabase.removeChannel(sub);
});

// Meta
const meta = computed(() => {
  var meta = values_data.value.find((v) => v.id == 1);
  return meta ? meta.meta : {};
});

// Activer le truc pour tout le monde
const activate = async (v) => {
  var m = meta.value;
  m.active = v;
  const { error } = await supabase
    .from("holygames-chevalier-2023-07")
    .update({ meta: m })
    .eq("id", 1);
};

// UUID
if (!$q.localStorage.has("ChevalierUUID"))
  $q.localStorage.set("ChevalierUUID", uuid()); //au cas ou crypto.randomUUID() est pas encore bien établi
const UUID = $q.localStorage.getItem("ChevalierUUID");

/*
L'IMPORTANT, C'EST LES VALEURS
*/
const values = computed(() => {
  var n_votes = values_data.value.length - 1;
  // On prend toutes les valeurs dans les votes
  var values = values_data.value.filter((v) => v.value).map((v) => v.value);
  // On ajoute les valeurs par défault
  values = values.concat(meta.value.defaults);
  // On enlève les duplicas
  values = [...new Set(values)];
  return values
    .map((v) => ({
      name: v,
      votes: values_data.value.filter((n) => n.value == v).length,
      percent: n_votes
        ? values_data.value.filter((n) => n.value == v).length / n_votes
        : 0,
      active: my_votes.value.map((m) => m.value).includes(v),
    }))
    .sort((a, b) => b.votes - a.votes);
});

const my_votes = computed(() => {
  return values_data.value.filter((v) => v.user == UUID);
});

// Delayed updates
const now = ref(Date.now());
const last_update = ref(0);
const delayed_values = ref(values.value);
setInterval(() => (now.value = Date.now()), 1000);
watch(now, () => {
  if (now.value - last_update.value > 5000) {
    last_update.value = now.value;
    delayed_values.value = values.value;
  }
});

const unvote = async (id) => {
  const { error } = await supabase
    .from("holygames-chevalier-2023-07")
    .delete()
    .eq("id", id);
};

const vote = async (name) => {
  if (my_votes.value.map((v) => v.value).includes(name)) {
    // On a déjà voté pour, donc on dévote
    var id = my_votes.value.find((v) => v.value == name).id;
    unvote(id);
  } else {
    // On vérifie si on a pas déjà fait 3 votes
    if (my_votes.value.length < 3) {
      const { error } = await supabase
        .from("holygames-chevalier-2023-07")
        .insert({ user: UUID, value: name });
    } else {
      $q.notify("Maximum 3 votes par personne ;)");
    }
  }
};

const add = async () => {
  $q.dialog({
    title: "L'important c'est les valeurs",
    prompt: {
      model: "",
      type: "text",
    },
    cancel: {
      label: "Annuler",
      flat: true,
      color: "grey",
    },
  }).onOk((data) => {
    data = data.trim();
    if (data) {
      vote(data);
    }
  });
};

const delete_vote = async (name) => {
  $q.dialog({
    title: "Attention",
    message: `Tu vas supprimer tous les votes pour ${name}. Sûr?`,
  }).onOk(async () => {
    const { error } = await supabase
      .from("holygames-chevalier-2023-07")
      .delete()
      .eq("value", name);
  });
};
</script>

<style lang="scss">
.content {
  strong,
  em {
    color: #800080;
  }
  h4,
  h5 {
    margin: 0.5em 0;
    color: #800080;
  }
}
</style>
