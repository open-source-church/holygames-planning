<template>
  <q-page padding>
    <h3>{{ day }}</h3>
    <q-list>
      <q-expansion-item
        popup
        group="somegroup"
        v-for="event in gsheet.byDay(day)"
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
            <q-item-label> {{ event.Name }} </q-item-label>
            <q-item-label caption v-if="!event.header">
              <q-badge :color="event.Color">{{ event.Place }}</q-badge>
              {{ event.time }}
            </q-item-label>
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
import { defineComponent } from "vue";
import { usegSheet } from "stores/gsheet";

export default defineComponent({
  name: "DayPage",
  props: ["day"],
  setup() {
    const gsheet = usegSheet();
    gsheet.getData();
    return { gsheet };
  },
});
</script>
