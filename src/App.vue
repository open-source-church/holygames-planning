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
      .channel("*")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "holygames-planning-2022-11" },
        (d) => {
          global.fetchPlanning();
        }
      )
      .subscribe();
    // Check for login status change
    supabase.auth.onAuthStateChange((_, session) => {
      try {
        global.user = session.user;
      } catch {
        global.user = null;
      }
    });
    // onMounted(async () => (global.user = await supabase.auth.getUser()));
  },
});
</script>
