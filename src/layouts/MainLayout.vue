<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <q-btn flat to="/"> Horaires holygames </q-btn>
        </q-toolbar-title>

        <div>Juillet 2022</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Jour de la semaine </q-item-label>
        <q-item v-for="day in gsheet.days" :key="day" :to="day">
          <q-item-section>{{ day }}</q-item-section>
        </q-item>
        <q-item to="*">
          <q-item-section>Toutes les activités</q-item-section>
        </q-item>
      </q-list>
      <div class="q-mt-xl q-pa-md text-grey text-caption">
        {{ gsheet.lastUpdated }}
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { usegSheet } from "stores/gsheet";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);

    // On utilise le calendrier
    const gsheet = usegSheet();
    gsheet.getData();

    setInterval(gsheet.updateData, 5 * 60 * 1000);

    return {
      gsheet,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
