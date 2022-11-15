<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Edit {{ tab }}</div>
      </q-card-section>
      <q-card-section class="q-col-gutter-sm column">
        <q-input v-model="newInfo" filled type="textarea" class="col-12" />
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
    const info = computed(() => global.info(props.tab));

    watch(
      () => props.tab,
      () => {
        newInfo.value = info.value;
      },
      { immediate: true }
    );

    const updateEvent = async () => {
      var d = await supabase
        .from("holygames-info-2022-11")
        .update({ content: newInfo.value })
        .match({ tab: props.tab });
      console.log(d);
      global.fetchInfo();
      onDialogOK();
    };

    return {
      newInfo,
      updateEvent,
      dialogRef,
      onDialogHide,
      global,
    };
  },
});
</script>
