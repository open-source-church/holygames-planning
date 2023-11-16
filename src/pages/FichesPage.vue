<template>
  <q-page padding>
    <div class="text-center no-print">
      <q-btn-group push class="q-my-md">
        <q-btn
          v-for="(v, k) in global.classes"
          :key="k"
          :icon="v.icon"
          @click="toggleFilter(k)"
          :push="filterCat.includes(k)"
          :color="v.color + '-1'"
          :text-color="v.color"
        >
          <q-tooltip class="bg-accent">{{ k }}</q-tooltip>
        </q-btn>
      </q-btn-group>
    </div>

    <div class="row fiches">
      <q-card
        square
        flat
        v-for="e in _.sortBy(filteredEvents, ['category', 'day', 'time'])"
        :key="e.id"
        style="width: 9.5cm; height: 13.85cm; margin: 5mm"
        :class="'column ' + global.categoryInfo(e.category).color"
      >
        <!-- <q-card-section :class="global.categoryInfo(e.category).classes + ' '"> -->
        <q-card-section
          :class="
            'bg-' + global.categoryInfo(e.category).color + '-10 text-white'
          "
        >
          <div class="absolute-right" style="opacity: 0.2">
            <q-icon size="6em" :name="global.categoryInfo(e.category).icon" />
          </div>
          <div class="text-h6">{{ e.name }}</div>
          <div class="text-subtitle2">
            <q-icon :name="global.categoryInfo(e.category).icon" />
            {{ global.categoryInfo(e.category).name }}
          </div>
        </q-card-section>
        <q-card-section class="col-auto q-px-sm q-pt-sm q-pb-none" style="font-size: 3.5mm">
          <div v-html="e._description" />
        </q-card-section>
        <q-card-section class="col-auto q-pa-sm">
          <div><b>Infos:</b> {{ e.day }}, {{ e.time }}, {{ e.place }}</div>
          <div><b>Pour qui:</b> {{ e.public }}</div>
          <div><b>Proposé par:</b> {{ e.contact }}</div>
          <div v-if="e.slots" class="row">
            <span class="col-auto"><b>Places:</b> {{ e.slots }}</span>
            <span
              v-if="e.inscription"
              :class="
                'text-italic col text-right text-' +
                global.categoryInfo(e.category).color +
                '-10'
              "
            >
              <q-icon name="warning" class="q-mr-sm" />Inscription
              obligatoire</span
            >
          </div>
        </q-card-section>
        <q-card-section
          v-if="e.inscription || e.slots"
          :class="
            'col q-pa-sm bg-' + global.categoryInfo(e.category).color + '-1'
          "
        >
          <span
            v-if="e.inscription"
            :class="
              'absolute-bottom text-center text-' +
              global.categoryInfo(e.category).color +
              '-10'
            "
            style="font-size: 2.5mm"
            >Merci de vous inscrire si vous êtes certain d'y participer</span
          >
          <span
            v-else
            :class="
              'absolute-bottom text-center text-' +
              global.categoryInfo(e.category).color +
              '-10'
            "
            style="font-size: 2.5mm"
            >Merci d'indiquer si vous pensez participer, ça aide à
            l'organisation</span
          >
          <b v-if="e.inscription">Je m'inscris:</b>
          <b v-else>Je pense participer:</b>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  resolveDirective,
} from "vue";
import { useGlobal } from "stores/global";
import { _ } from "lodash";

const global = useGlobal();
var cat = ref([]);

var filterCat = reactive([]);
const filteredEvents = computed(() => {
  var all = global.events;
  if (filterCat.length == 0) return all;
  else return all.filter((e) => filterCat.includes(e.category) || e.header);
});
const toggleFilter = (k) => {
  if (filterCat.includes(k)) filterCat.splice(filterCat.indexOf(k), 1);
  else filterCat.push(k);
};
</script>

<style>
.fiches p {
  margin-bottom: 8px;
}
.fiches .purple b {
  color: #4a148c;
}
.fiches .red b {
  color: #b71c1c;
}
.fiches .amber b {
  color: #ff6f00;
}
.fiches .lime b {
  color: #827717;
}
.fiches .cyan b {
  color: #006064;
}

@media print {
  .no-print,
  .q-drawer-container,
  header {
    display: none !important;
  }

  .q-page-container {
    padding: 0 !important;
  }
  .q-layout-padding {
    padding: 0mm !important;
  }
}
</style>
