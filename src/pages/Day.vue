<template>
  <q-page padding>
    <h4 class="q-my-md" v-if="day !== '*'">{{ day }}</h4>

    <q-banner class="col-12 bg-orange-3">
      <template v-slot:avatar>
        <q-icon name="build" color="orange" />
      </template>
      Contenu pas finalisé, revenez dans quelques jours.
    </q-banner>
    <div class="text-center">
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
    <q-list>
      <q-expansion-item
        popup
        group="somegroup"
        v-for="event in filteredEvents"
        :key="event.id"
        :id="`item-${event.id}`"
        :model-value="index == event.id"
        @show="nav(event.id)"
        expand-separator
        :header-class="
          event.category ? global.classes[event.category].classes : ''
        "
        :header="event.header"
        :expand-icon="event.description ? 'expand_more' : 'a'"
        :dense="event.dense"
      >
        <template v-slot:header>
          <q-item-section avatar v-if="!event.header">
            <q-avatar :icon="global.classes[event.category].icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label> {{ event.name }}</q-item-label>
            <q-item-label caption v-if="!event.header">
              <q-badge :color="event.color">{{ event.place }}</q-badge>
              {{ event.time }}
              <q-badge
                v-if="event.places"
                rounded
                :color="event.color + '-3'"
                :text-color="event.color + '-10'"
                >{{ event.places }}</q-badge
              >
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <q-icon
                name="how_to_reg"
                :color="event.classes"
                size="24px"
                v-if="event.inscription && !event.full"
              >
                <q-tooltip>Sur inscription</q-tooltip>
              </q-icon>
              <q-icon
                name="person_off"
                :color="event.classes"
                size="24px"
                v-if="event.inscription && event.full"
              >
                <q-tooltip>Complet</q-tooltip>
              </q-icon>
              <q-icon
                name="edit"
                size="24px"
                right
                v-if="global.admin && event && !event.header"
                @click.stop="editEvent(event.id)"
              >
                <q-tooltip>Edit</q-tooltip>
              </q-icon>
            </div>
          </q-item-section>
        </template>

        <q-card v-if="event.description">
          <q-card-section>
            <div v-html="event.description" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { useGlobal } from "stores/global";
import { _ } from "lodash";
import { useRouter } from "vue-router";
import { scroll, useQuasar } from "quasar";
const { getScrollTarget, setVerticalScrollPosition } = scroll;
import EditDialog from "components/EditDialog.vue";

export default defineComponent({
  name: "DayPage",
  props: ["day", "index"],
  // components: { EditDialog },
  setup(props) {
    const global = useGlobal();
    var cat = ref([]);

    var filterCat = reactive([]);
    const filteredEvents = computed(() => {
      var all = global.byDay(props.day);
      if (filterCat.length == 0) return all;
      else return all.filter((e) => filterCat.includes(e.category) || e.header);
    });
    const toggleFilter = (k) => {
      if (filterCat.includes(k)) filterCat.splice(filterCat.indexOf(k), 1);
      else filterCat.push(k);
    };

    const router = useRouter();
    const nav = (index) => router.replace({ path: `/${props.day}/${index}` });

    const scrollTo = () => {
      var el = document.getElementById(`item-${props.index}`);
      if (!el) return setTimeout(scrollTo, 100);
      const target = getScrollTarget(el);
      const offset = el.offsetTop;
      const duration = 1000;
      setVerticalScrollPosition(target, offset, duration);
    };
    onMounted(() => {
      if (props.index) setTimeout(scrollTo, 100);
    });

    const $q = useQuasar();
    const editEvent = (id) => {
      $q.dialog({
        component: EditDialog,
        componentProps: { id: id },
      });
    };

    return {
      global,
      cat,
      filteredEvents,
      filterCat,
      toggleFilter,
      nav,
      editEvent,
    };
  },
});
</script>
