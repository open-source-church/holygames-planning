<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useGlobal } from "stores/global";
import { supabase } from "./supabase";

export default defineComponent({
  name: "App",
  setup() {
    const global = useGlobal();
    // Update events
    global.fetchPlanning();
    // Update info
    global.fetchInfo();
    // Subscribe to events modif
    const subscription = supabase
      .from("holygames-planning-2022-11")
      .on("*", (d) => {
        global.fetchPlanning();
      })
      .subscribe();
    // Check for login status change
    supabase.auth.onAuthStateChange((_, session) => {
      global.user = session.user;
    });
    onMounted(() => (global.user = supabase.auth.user()));
  },
});
</script>
