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
          <q-item-label>{{ e.name }}</q-item-label>
          <q-item-label caption>{{ e.date }}</q-item-label>
        </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-icon
              size="xs"
              :name="e.visible ? 'visibility' : 'visibility_off'"
            />
            <q-icon size="xs" name="star" :color="e.active ? 'orange' : ''" />
            <q-btn size="12px" flat dense round icon="edit" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-card class="q-mt-md" v-if="current.id">
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
          <q-toggle class="col-6" v-model="current.active" label="Active" />
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
  var d = await supabase
    .from("holygames-planning-events")
    .update(current.value)
    .match({ id: current.value.id });
  console.log(d);
  global.fetchEvents();
  current.value = {};
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
</script>

<style></style>
