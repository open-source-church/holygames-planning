<template>
  <q-page padding>
    <h4 class="q-mb-md" v-if="day !== '*'">{{ day }}</h4>
    <div class="text-center">
      <q-btn-group push class="q-my-md">
        <q-btn
          v-for="(v, k) in gsheet.categories"
          :key="k"
          :icon="v.icon"
          @click="toggleFilter(k)"
          :push="filterCat.includes(k)"
          :color="v.color + '-1'"
          :text-color="v.color"
        >
          <q-tooltip class="bg-accent">{{ k }}</q-tooltip>
        </q-btn>
      </q-btn-group>
    </div>
    <q-list>
      <q-expansion-item
        popup
        group="somegroup"
        v-for="event in filteredEvents"
        :key="event.description"
        expand-separator
        :header-class="event.Classes"
        :header="event.header"
        :expand-icon="event.Description ? 'expand_more' : 'a'"
        :dense="event.dense"
      >
        <template v-slot:header>
          <q-item-section avatar v-if="!event.header || event.dense">
            <q-avatar :icon="event.Icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label> {{ event.Name }}</q-item-label>
            <q-item-label caption v-if="!event.header">
              <q-badge :color="event.Color">{{ event.Place }}</q-badge>
              {{ event.time }}
              <q-badge
                v-if="event.Places"
                rounded
                :color="event.Color + '-3'"
                :text-color="event.Color + '-10'"
                >{{ event.Places }}</q-badge
              >
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <q-icon
                name="how_to_reg"
                :color="event.Classes"
                size="24px"
                v-if="event.Inscription && !event.Full"
              >
                <q-tooltip>Sur inscription</q-tooltip>
              </q-icon>
              <q-icon
                name="person_off"
                :color="event.Classes"
                size="24px"
                v-if="event.Inscription && event.Full"
              >
                <q-tooltip>Complet</q-tooltip>
              </q-icon>
            </div>
          </q-item-section>
        </template>

        <q-card v-if="event.Description">
          <q-card-section>
            <div v-html="event.Description" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed } from "vue";
import { usegSheet } from "stores/gsheet";
import { _ } from "lodash";

export default defineComponent({
  name: "DayPage",
  props: ["day"],
  setup(props) {
    const gsheet = usegSheet();
    gsheet.getData();
    var cat = ref([]);

    var filterCat = reactive([]);
    const filteredEvents = computed(() => {
      var all = gsheet.byDay(props.day);
      if (filterCat.length == 0) return all;
      else return all.filter((e) => filterCat.includes(e.Category) || e.header);
    });
    const toggleFilter = (k) => {
      if (filterCat.includes(k)) filterCat.splice(filterCat.indexOf(k), 1);
      else filterCat.push(k);
    };

    return { gsheet, cat, filteredEvents, filterCat, toggleFilter };
  },
});
</script>
