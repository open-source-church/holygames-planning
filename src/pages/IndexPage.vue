<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    {{ gsheet.data }}
    <hr />
    <q-btn :label="gsheet.count" @click="gsheet.increment"></q-btn>
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
    gsheet.getFramagenda();
    return { gsheet };
  },
});
</script>
