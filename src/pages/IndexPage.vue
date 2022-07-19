<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    {{ gsheet.data }}
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
