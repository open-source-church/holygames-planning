<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card>
      <q-toolbar class="bg-primary text-white fixed-top" style="z-index: 1000">
        <q-toolbar-title> Edit {{ tab }} </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
        <q-btn icon="check" flat round dense @click="updateEvent" />
      </q-toolbar>
      <q-card-section class="q-col-gutter-sm column q-mt-xl">
        <q-input
          v-model="newInfo"
          filled
          autogrow
          type="textarea"
          class="col-12"
        />
        <q-toggle
          label="Afficher la vidéo"
          v-model="newVideo"
          v-if="['accueil', 'spi', 'jeux', 'info'].includes(tab)"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat label="Annuler" @click="onDialogHide"></q-btn>
        <q-btn
          flat
          color="primary"
          label="Enregistrer"
          @click="updateEvent"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import { useGlobal } from "stores/global";
import { _ } from "lodash";
import { supabase } from "../supabase";
import { useDialogPluginComponent } from "quasar";

export default defineComponent({
  name: "EditInfoDialog",
  props: {
    tab: {
      type: String,
      default: "",
    },
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const global = useGlobal();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const newInfo = ref("");
    const newVideo = ref(true);
    const info = computed(() => global.info(props.tab));

    watch(
      () => props.tab,
      () => {
        newInfo.value = info.value;
        newVideo.value = global.video(props.tab);
      },
      { immediate: true }
    );

    const updateEvent = async () => {
      console.log("Current Id:", global.currentEventId);
      // Does info exists for that event ?
      var test = global.infoSrc.find(
        (i) => i.tab == props.tab && i.event == global.currentEventId
      );
      console.log(
        "TEST:",
        test,
        global.infoSrc,
        props.tab,
        global.currentEventId
      );
      if (
        global.infoSrc.find(
          (i) => i.tab == props.tab && i.event == global.currentEventId
        )
      )
        var d = await supabase
          .from("holygames-planning-info")
          .update({ content: newInfo.value, video: newVideo.value })
          .match({ tab: props.tab, event: global.currentEventId });
      else
        var d = await supabase.from("holygames-planning-info").insert({
          content: newInfo.value,
          video: newVideo.value,
          tab: props.tab,
          event: global.currentEventId,
        });
      console.log(d);
      global.fetchInfo();
      onDialogOK();
    };

    return {
      newInfo,
      newVideo,
      updateEvent,
      dialogRef,
      onDialogHide,
      global,
    };
  },
});
</script>
