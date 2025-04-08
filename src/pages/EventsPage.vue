<template>
  <q-page padding>
    <q-btn flat label="Nouvel événement" @click="addEvent" icon="add" />
    <q-list bordered separator>
      <q-item
        clickable
        v-for="e in global.eventsList"
        :key="e.id"
        @click="editEvent(e.id)"
        :class="
          e.id == current.id ? 'bg-orange-2' : !e.visible ? 'bg-grey-4' : ''
        "
      >
        <q-item-section>
          <q-item-label caption>{{ e.name }}</q-item-label>
          <q-item-label>{{ e.date }}</q-item-label>
        </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-icon
              size="xs"
              :name="e.visible ? 'visibility' : 'visibility_off'"
            />
            <q-icon size="xs" name="star" :color="e.active ? 'orange' : ''" />
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click="editEvent(e.id)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-card class="q-mt-md" v-if="current.id">
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">{{ current.name }}</div>
        <div class="text-subtitle2">Modifier l'événement</div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <q-input
            filled
            class="col-12"
            label="Type d'événement"
            v-model="current.name"
          />
          <q-input
            filled
            class="col-12"
            label="Date générale"
            v-model="current.date"
          />
          <q-toggle class="col-6" v-model="current.visible" label="Visible" />
          <div class="col-6 row justify-between">
            <q-toggle
              class="col"
              v-model="current.active"
              label="Événement actif"
            />
            <q-btn class="col-auto" icon="info" flat>
              <q-tooltip
                >L'événement actif est celui qui s'affiche pour les gens pas
                admins. Il ne peut y en avoir qu'un.</q-tooltip
              >
            </q-btn>
          </div>
          <q-input
            filled
            class="col-6"
            v-model="current.start"
            mask="date"
            :rules="['date']"
            label="Start"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="current.start">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            class="col-6"
            v-model="current.end"
            mask="date"
            :rules="['date']"
            label="Fin"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="current.end">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <q-select
            class="col"
            v-model="clone_from_event"
            :options="list.filter((e) => current.id != e.id)"
            :option-label="(o) => o.name + ': ' + o.date"
            label="Copier les événements et info depuis:"
            hint="Évenement à cloner"
          />
          <q-btn
            class="col-auto text-primary"
            flat
            icon="content_copy"
            label="Copier"
            @click="clone_event"
          />
          <q-separator vertical inset />
          <q-btn
            class="col-auto text-negative"
            flat
            icon="delete"
            label="Supprimer tous les événements"
            @click="clear_events"
          />
        </div>
      </q-card-section>
      <q-banner
        class="text-white bg-red"
        v-if="
          global.dayRange(current.start, current.end) < 1 ||
          global.dayRange(current.start, current.end) > 7
        "
      >
        <template v-slot:avatar>
          <q-icon name="error" color="white" />
        </template>
        La durée doit être en 1 et 7 jours, et pas
        {{ global.dayRange(current.start, current.end) }}</q-banner
      >
      <q-separator />

      <q-card-actions horizontal align="right">
        <q-btn flat color="warning" icon="undo" @click="current = {}"
          >Annuler</q-btn
        >
        <q-btn flat color="negative" icon="delete" @click="deleteEvent"
          >Supprimer</q-btn
        >
        <q-btn flat color="positive" icon="save" @click="saveEvent"
          >Enregistrer</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  resolveDirective,
} from "vue";
import { useGlobal } from "stores/global";
import { _ } from "lodash";
import { supabase } from "../supabase";
import { useQuasar } from "quasar";

const global = useGlobal();

const list = computed(() => {
  return _.sortBy(global.eventsList, "start");
});

const switchVisibility = (id) => {
  console.log(id);
};

const current = ref({});
const editEvent = (id) => {
  current.value = _.cloneDeep(global.eventsList.filter((e) => e.id == id)[0]);
};

const saveEvent = async () => {
  var item = _.clone(current.value);
  delete item.active;
  var d = await supabase
    .from("holygames-planning-events")
    .update(item)
    .match({ id: current.value.id });
  console.log(d);
  if (current.value.active) setActiveEvent(current.value.id);
  else {
    global.fetchEvents();
    current.value = {};
  }
};

const addEvent = async () => {
  console.log("Add event");
  var d = await supabase.from("holygames-planning-events").insert({});
  console.log(d);
  global.fetchEvents();
};

const deleteEvent = async () => {
  console.log("Delete event");
  var d = await supabase
    .from("holygames-planning-events")
    .delete()
    .eq("id", current.value.id);
  console.log(d);
  current.value = {};
  global.fetchEvents();
};

const setActiveEvent = async (id) => {
  // Remove active event
  var currentActiveId = global.eventsList.find((e) => e.active);
  if (currentActiveId)
    await supabase
      .from("holygames-planning-events")
      .update({ active: null })
      .match({ id: currentActiveId.id });
  // Set active event
  await supabase
    .from("holygames-planning-events")
    .update({ active: true })
    .match({ id: current.value.id });
  current.value = {};
  global.fetchEvents();
};

const $q = useQuasar();

// Clone events
const clone_from_event = ref();

const clone_event = async () => {
  if (!clone_from_event.value?.id) {
    $q.notify("Choisis un événement source à coper, s'il te plait.");
    return;
  }

  console.log(clone_from_event.value);
  console.log(current.value.id);

  const { data } = await supabase
    .from("holygames-planning-activities")
    .select()
    .eq("event", clone_from_event.value.id);
  data.forEach((e) => (e.event = current.value.id));
  data.forEach((e) => delete e.id);
  data.forEach((e) => delete e.created_at);

  const { error } = await supabase
    .from("holygames-planning-activities")
    .insert(data);
  console.log(error);
  if (error) $q.notify("Erreur: ", error);
  else $q.notify(`${data.length} événements copiés avec succès.`);

  const r_infos = await supabase
    .from("holygames-planning-info")
    .select()
    .eq("event", clone_from_event.value.id);

  r_infos.data.forEach((e) => (e.event = current.value.id));
  r_infos.data.forEach((e) => delete e.id);
  r_infos.data.forEach((e) => delete e.created_at);

  const response = await supabase
    .from("holygames-planning-info")
    .insert(r_infos.data);
  if (response.error) $q.notify("Erreur: ", response.error);
  else $q.notify(`${r_infos.data.length} infos copiés avec succès.`);
};
const clear_events = async () => {
  console.log(current.value.id);

  const response = await supabase
    .from("holygames-planning-activities")
    .delete()
    .eq("event", current.value.id);

  if (!response.error) {
    $q.notify(`Toutes activités supprimées avec succès.`);
  } else {
    $q.notify(`Erreur: ${response.error}`);
  }
  const response2 = await supabase
    .from("holygames-planning-info")
    .delete()
    .eq("event", current.value.id);

  if (!response2.error) {
    $q.notify(`Toutes infos supprimées avec succès.`);
  } else {
    $q.notify(`Erreur: ${response2.error}`);
  }
};
</script>

<style></style>
