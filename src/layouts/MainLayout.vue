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

        <div>Novembre 2022</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Info</q-item-label>
        <q-item to="/bienvenue"
          ><q-item-section>Informations générales</q-item-section>
        </q-item>
        <q-item-label header>Planning</q-item-label>
        <q-item v-for="day in global.activeDays" :key="day" :to="`/${day}`">
          <q-item-section>{{ day }}</q-item-section>
        </q-item>
        <q-item to="*">
          <q-item-section>Toutes les activités</q-item-section>
        </q-item>
      </q-list>
      <div class="q-mt-xl q-pa-md text-grey text-caption" v-if="global.user">
        Log en tant que {{ global.user.id }}
        <span v-if="global.admin">(admin) </span>
        <a @click="logout">Log out</a>.
      </div>
      <div
        class="q-mt-xl q-pa-md text-grey text-caption"
        v-else
        @click="handleLogin"
      >
        Login
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { usegSheet } from "stores/gsheet";
import { useGlobal } from "stores/global";
import { useQuasar } from "quasar";
import { supabase } from "../supabase";

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// Login with supabase
const global = useGlobal();
const email = ref("");
const $q = useQuasar();
const handleLogin = async () => {
  try {
    $q.dialog({
      title: "Login",
      message:
        "Entre ton email (mais en fait si t'es pas Olivier ça sert à rien, vraiment).",
      prompt: {
        model: "",
        type: "text", // optional
      },
      cancel: true,
      persistent: false,
    }).onOk(async (data) => {
      $q.loading.show();
      const { error } = await supabase.auth.signInWithOtp({ email: data });
      if (error) throw error;
      $q.loading.hide();
      $q.dialog({
        title: "Mischief achieved",
        message: "Vérifie ton email.",
      });
    });
  } catch (error) {
    alert(error.error_description || error.message);
  } finally {
    $q.loading.hide();
  }
};
const logout = async () => {
  try {
    $q.loading.show();
    let { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    $q.loading.hide();
  }
};
</script>
