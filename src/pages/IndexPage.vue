<template>
  <q-page class="flex flex-center row">
    <div class="col-12 text-center">
      <img
        alt="Logo holygames"
        src="~assets/holygames-logo-tag-vertical.svg"
        style="width: 200px; height: 200px"
      />
    </div>
    <div class="col-8 col-offset-4 row">
      <q-btn
        color="blue"
        to="/bienvenue"
        label="Bienvenue !"
        icon="info"
        class="col-12 q-mb-md"
      />
      <q-btn
        v-for="day in gsheet.days"
        :key="day"
        :to="day"
        :label="day"
        class="col-12 q-mb-md"
      /><q-btn to="*" label="Toutes les activités" class="col-12 q-mb-md" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { usegSheet } from "stores/gsheet";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const gsheet = usegSheet();
    gsheet.getData();
    return { gsheet };
  },
});
</script>
