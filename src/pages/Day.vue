<template>
  <q-page>
    <h1>{{ day }}</h1>
    <q-list bordered>
      <q-expansion-item
        v-for="event in gsheet.byDay(day)"
        :key="event.description"
        expand-separator
        :icon="event.Icon"
        :label="event.Name"
        :caption="event.time"
        :header-class="event.Classes"
        :disable="!event.Description"
      >
        <q-card v-if="event.Description">
          <q-card-section
            ><div v-html="event.Description"></div
          ></q-card-section>
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
