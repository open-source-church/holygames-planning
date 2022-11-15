<template>
  <q-dialog ref="dialogRef" transition-show="rotate" transition-hide="rotate">
    <q-card>
      <q-card-section class="q-col-gutter-sm row">
        <q-input
          class="col-12"
          filled
          label="Nom"
          v-model="newEvent.name"
        ></q-input>
        <q-select
          filled
          label="Jour"
          :options="global.days"
          v-model="newEvent.day"
          class="col-6"
        ></q-select>
        <q-input
          class="col-3"
          filled
          v-model="newEvent.start"
          mask="time"
          :rules="['time']"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="newEvent.start" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          class="col-3"
          filled
          v-model="newEvent.end"
          mask="time"
          :rules="['time']"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="newEvent.end" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          class="col-6"
          filled
          label="Lieu"
          v-model="newEvent.place"
        ></q-input>
        <q-select
          filled
          label="Catégorie"
          :options="global.categories"
          v-model="newEvent.category"
          class="col-6"
        ></q-select>
        <q-input
          dense
          clearable
          class="col-12"
          filled
          label="Description"
          v-model="newEvent.description"
          type="textarea"
        ></q-input>
        <q-input
          dense
          clearable
          class="col-6"
          filled
          label="Contact"
          v-model="newEvent.contact"
        ></q-input>
        <q-input
          dense
          clearable
          class="col-6"
          filled
          label="Public cible"
          v-model="newEvent.public"
        ></q-input>
        <!-- Inscriptions -->
        <q-toggle
          dense
          class="col-3"
          v-model="newEvent.inscription"
          label="Inscription"
          left-label
        />
        <q-input
          v-model.number="newEvent.slots"
          type="number"
          filled
          dense
          label="Nombre de places"
          class="col-3"
        />
        <q-input
          v-model.number="newEvent.free"
          type="number"
          filled
          dense
          label="Places libres"
          class="col-3"
        />
        <q-toggle dense class="col-3" v-model="newEvent.rdv" label="RDV fixe" />
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
        <q-btn flat color="green" label="Nouveau" @click="createEvent"></q-btn>
        <q-btn flat color="red" label="Supprimer" @click="deleteEvent"></q-btn>
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
  name: "EditDialog",
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const global = useGlobal();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const newEvent = ref({});
    const event = computed(() => global.srcById(props.id));

    watch(
      () => props.id,
      () => {
        newEvent.value = _.cloneDeep(event.value);
      },
      { immediate: true }
    );

    const updateEvent = async () => {
      var e = _.clone(newEvent.value);
      var d = await supabase
        .from("holygames-planning-2022-11")
        .update(e)
        .match({ id: props.id });
      console.log(d);
      onDialogOK();
    };

    const createEvent = async () => {
      var e = _.clone(newEvent.value);
      delete e.id;
      var d = await supabase.from("holygames-planning-2022-11").insert(e);
      console.log(d);
      onDialogOK();
    };

    const deleteEvent = async () => {
      var e = _.clone(newEvent.value);
      var d = await supabase
        .from("holygames-planning-2022-11")
        .delete()
        .match({ id: props.id });
      console.log(d);
      onDialogOK();
    };

    return {
      event,
      newEvent,
      updateEvent,
      createEvent,
      deleteEvent,
      dialogRef,
      onDialogHide,
      global,
    };
  },
});
</script>
