<template>
  <q-page padding>
    <h4 class="q-my-md" v-if="day !== '*'">{{ day }}</h4>

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
    <div class="row" v-for="day in global.days" :key="day">
      <template
        v-if="
          (props.day == '*' || day == props.day) &&
          filteredEventsByDay(day).filter((e) => !e.header).length
        "
      >
        <q-scroll-area
          class="full-width"
          :style="`height: calc(${
            _.uniq(
              filteredEventsByDay(day)
                .map((e) => e.place)
                .filter((e) => e)
            ).length + 1
          }*1.3rem);`"
        >
          <div
            :style="`width: ${timelineWidth}%; height: 1.3rem`"
            class="text-caption text-grey"
          >
            <div
              class="absolute float-left text-subtitle2 text-black"
              v-if="props.day == '*'"
            >
              {{ day }}
            </div>
            <q-icon name="schedule" v-else />
            <div
              v-for="h in _.range(6, 24)"
              :key="h"
              class="absolute text-center"
              :style="{
                left: ((h - 5 - 0.5) / 19) * timelineWidth + '%',
                width: (1 / 19) * timelineWidth + '%',
                top: 0,
              }"
            >
              {{ h }}h
            </div>
          </div>

          <div
            v-for="(p, i) in _.uniq(
              filteredEventsByDay(day)
                .map((e) => e.place)
                .filter((e) => e)
            )"
            :key="p"
            :class="`text-caption ${i % 2 == 0 ? 'bg-grey-1' : 'bg-grey-2'}`"
            :style="`width: ${timelineWidth}%; height: 1.3rem`"
          >
            <div class="float-left text-grey-8">{{ p }}</div>

            <div
              v-for="e in filteredEventsByDay(day).filter((e) => e.place == p)"
              :key="e.id"
              :class="
                global.categoryInfo(e.category).classes +
                  ' absolute cursor-pointer' || ''
              "
              @click="nav(e.id) && scrollTo()"
              :style="{
                left: ((timeToInt(e.start) - 5) / 19) * timelineWidth + '%',
                width:
                  ((timeToInt(e.end) - timeToInt(e.start)) / 20) *
                    timelineWidth +
                  '%',
                overflow: 'visible',
                height: '1.25rem',
              }"
            >
              <span class="absolute-left q-pl-xs" style="width: max-content">{{
                e.name
              }}</span>
            </div>

            <div class="float-right text-grey-8">{{ p }}</div>
          </div>
        </q-scroll-area>
        <div style="height: 1rem">&nbsp;</div>
      </template>
    </div>
    <q-list>
      <q-expansion-item
        group="somegroup"
        v-for="event in filteredEvents"
        :key="event.id"
        :id="`item-${event.id}`"
        :model-value="index == event.id"
        @show="nav(event.id)"
        :header-class="global.categoryInfo(event.category).classes || ''"
        :header="event.header"
        :expand-icon="event.description ? 'expand_more' : 'a'"
        :dense="event.dense"
      >
        <template v-slot:header>
          <q-item-section avatar v-if="!event.header">
            <q-avatar :icon="global.categoryInfo(event.category).icon" />
          </q-item-section>

          <q-item-section v-if="!event.header">
            <q-item-label> {{ event.name }}</q-item-label>
            <q-item-label caption>
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
          <q-item-section v-else>
            <q-item-label
              :class="event.dense ? 'text-subtitle2' : 'text-subtitle1'"
              >{{ event.name }}</q-item-label
            >
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
          <div
            :class="global.categoryInfo(event.category).classes + ' q-pa-sm'"
          >
            <q-card-section class="q-pa-sm bg-white text-black rounded-borders">
              <div v-html="event.description" />
            </q-card-section>
          </div>
        </q-card>
      </q-expansion-item>
    </q-list>
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
import { useRouter } from "vue-router";
import { scroll, useQuasar } from "quasar";
import EditDialog from "components/EditDialog.vue";
const { getScrollTarget, setVerticalScrollPosition } = scroll;

const props = defineProps(["day", "index"]);
// components: { EditDialog },

const global = useGlobal();
var cat = ref([]);

var filterCat = reactive([]);
const filteredEvents = computed(() => {
  return filteredEventsByDay(props.day);
});
const filteredEventsByDay = (day) => {
  var all = global.byDay(day);
  if (filterCat.length == 0) return all;
  else return all.filter((e) => filterCat.includes(e.category) || e.header);
};
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

const timeToInt = (time) => ~~time.split(":")[0] + ~~time.split(":")[1] / 60;
const timelineWidth = computed(() => ($q.screen.gt.sm ? 100 : 300));
</script>
