<template>
  <q-page
    class="content column full-height"
    v-touch-swipe.left="swipeLeft"
    v-touch-swipe.right="swipeRight"
  >
    <q-tab-panels v-model="tab" animated class="col column full-width">
      <q-tab-panel name="accueil">
        <q-video :ratio="16/9" src="https://www.youtube.com/embed/XIIGx8drZB8" />
        <div v-html="info('accueil')" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="info">
        <q-video :ratio="16/9" src="https://www.youtube.com/embed/bByuRYAB7NU" />
        <div v-html="info('info')" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="spi">
        <q-video :ratio="16/9" src="https://www.youtube.com/embed/lRSDQ_t8pNA" />
        <div v-html="info('spi')" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="jeux">
        <q-video :ratio="16/9" src="https://www.youtube.com/embed/3Ds_SgbWDXs" />
        <div v-html="info('jeux')" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="kids">
        <div v-html="info('kids')" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="salles">
        <div v-html="info('salles')" class="q-mb-xl" />
      </q-tab-panel>
    </q-tab-panels>
    <q-separator />
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 60]"
      v-if="global.admin"
    >
      <q-btn fab icon="edit" color="accent" @click.stop="editInfo(tab)" />
    </q-page-sticky>
    <!-- <q-page-sticky position="bottom" class="bg-purple" style="max-width: 100%"> -->
    <q-tabs
      v-model="tab"
      dense
      class="bg-purple text-white full-width fixed-bottom"
      inside-arrows
      mobile-arrows
      @touchstart.stop
    >
      <q-tab name="accueil" label="Bienvenue" icon="favorite" />
      <q-tab name="info" label="Infos" icon="info" />
      <q-tab name="spi" label="Spi" icon="local_fire_department" />
      <q-tab name="jeux" label="Jeux" icon="casino" />
      <q-tab name="kids" label="Enfants" icon="child_care" />
      <q-tab name="salles" label="Salles" icon="location_on" />
    </q-tabs>
    <!-- </q-page-sticky> -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useGlobal } from "stores/global";
import { _ } from "lodash";
import { marked } from "marked";
import { useQuasar } from "quasar";
import EditInfoDialog from "components/EditInfoDialog.vue";

export default defineComponent({
  name: "DayPage",
  props: ["day"],
  setup(props) {
    const global = useGlobal();

    // var bienvenue = computed(() => marked.parse(gsheet.info.bienvenue || ""));
    // var info = computed(() => marked.parse(gsheet.info.info || ""));
    // var kids = computed(() => marked.parse(gsheet.info.kids || ""));
    // var jeux = computed(() => marked.parse(gsheet.info.jeux || ""));
    // var salles = computed(() => marked.parse(gsheet.info.salles || ""));

    const formatted = (html) => {
      // https://www.youtube.com/watch?v=XIIGx8drZB8
      const frame = `
<iframe width="560" height="315"
src="https://www.youtube.com/embed/$1"
title="YouTube video player"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
</iframe>
      `;
      html = html.replaceAll(/https:\/\/www.youtube.com\/watch\?v=([^\s]*)/gi, frame);

      return html;
    };

    const info = (tab) => marked.parse(formatted(global.info(tab)));

    var tab = ref("accueil");

    const $q = useQuasar();
    const editInfo = (id) => {
      console.log(tab.value);
      $q.dialog({
        component: EditInfoDialog,
        componentProps: { tab: tab.value },
      });
    };

    const tabs = ["accueil", "info", "spi", "jeux", "kids", "salles"];
    const swipeLeft = () => {
      tab.value = tabs[(tabs.indexOf(tab.value) + 1) % tabs.length];
    };
    const swipeRight = () => {
      tab.value =
        tabs[(tabs.indexOf(tab.value) - 1 + tabs.length) % tabs.length];
    };

    return { tab, info, global, editInfo, swipeLeft, swipeRight };
  },
});
</script>

<style lang="scss">
.content {
  strong,
  em {
    color: #800080;
  }
  h4,
  h5 {
    margin: 0.5em 0;
    color: #800080;
  }
}
</style>
