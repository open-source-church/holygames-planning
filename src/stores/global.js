import { defineStore, setMapStoreSuffix } from "pinia";
import { _ } from "lodash";
import { marked } from "marked";
import { supabase } from "../supabase";
import { date } from "quasar";
import { ref, computed, watch } from "vue";

export const useGlobal = defineStore("global", () => {
  const user = ref(null);

  // List of all holygames events
  const eventsList = ref([]);
  const eventsSrc = ref([]);
  const infoSrc = ref([]);
  // Id of the currently display event
  const currentEventId = ref(null);
  // const days = ref([
  //   "Dimanche",
  //   "Lundi",
  //   "Mardi",
  //   "Mercredi",
  //   "Jeudi",
  //   "Vendredi",
  //   // "Samedi",
  //   // "Dimanche",
  // ]);

  const categories = ref([
    "Hotel",
    "RDV",
    "Spi",
    "JDR",
    "Repas",
    "Kids",
    "Jeu",
    "Nature",
  ]);

  const classes = ref({
    Hotel: {
      icon: "hotel",
      color: "red",
      classes: "bg-red-1 text-red-10",
      name: "Hôtel",
    },
    RDV: {
      icon: "groups",
      color: "red",
      classes: "bg-red-1 text-red-10",
      name: "Rendez-vous",
    },
    Spi: {
      icon: "local_fire_department",
      color: "purple",
      classes: "bg-purple-1 text-purple-10",
      name: "Activités spi et bienfaisantes",
    },
    JDR: {
      icon: "casino",
      color: "amber",
      classes: "bg-amber-1 text-amber-10",
      name: "Jeux de rôles",
    },
    Repas: {
      icon: "hotel",
      color: "brown",
      classes: "bg-brown-1 text-brown-10",
      name: "Repas",
    },
    Kids: {
      icon: "child_care",
      color: "cyan",
      classes: "bg-cyan-1 text-cyan-10",
      name: "Enfance",
    },
    Jeu: {
      icon: "extension",
      color: "lime",
      classes: "bg-lime-1 text-lime-10",
      name: "Jeux de société",
    },
    // Nature: {
    //   icon: "eco",
    //   color: "light-green",
    //   classes: "bg-light-green-1 text-light-green-10",
    // },
  });

  var _admin = -1;
  const admin = ref(false);
  const checkAdmin = async () => {
    console.log("Checking admin...");
    if (!user.value || _admin != -1) admin.value = false;
    else {
      var { data } = await supabase.rpc("holygames_planning_is_admin", {
        id: user.value.id,
      });
      admin.value = data ? data : false;
    }
    console.log("Yeah we checked, admin is", admin.value);
  };

  const srcById = computed(() => {
    console.log(eventsSrc.value);
    return (id) => eventsSrc.value.find((e) => e.id == id);
  });

  const all = computed(() => {
    var all = [];
    days.value.forEach((d) => {
      var day = byDay(d);
      if (day.length) {
        all.push({ header: true, name: d });
        all = all.concat(day);
      }
    });
    return all;
  });

  const events = computed(() => {
    return eventsSrc.value.map((ev) => {
      var e = _.clone(ev);
      // On complète la description
      const ftime = (t) => t.split(":").splice(0, 2).join("h");
      if (e.description) {
        e._description = marked.parse(e.description || "");
        if (e.rdv)
          e.description =
            e.description +
            "\n\n**Rendez-vous:** " +
            e.place +
            " à " +
            ftime(e.start) +
            "." +
            (e.inscription ? " **Inscription obligatoire!**" : "");
        if (e.slots && !e.inscription)
          e.description += `\n\n**Nombre de places:** ${e.slots}`;
        if (e.slots && e.inscription)
          e.description += `\n\n**Places restantes:** ${e.free} / ${e.slots} *(cette valeur n'est peut-être pas à jour, c'est le tableau dans la salle de jeu qui fait foi)*`;
        e.full = e.free == 0;
        if (e.public) e.description += `\n\n**Public:** ${e.public}`;
        if (e.contact)
          e.description = e.description + "\n\n**Contact:** " + e.contact;
        // On remplace // par \n\n
        e.description = e.description.replaceAll("\\", "\n\n");
        // Et on mouline
        e.description = marked.parse(e.description || "");
      }
      e.time = `${ftime(e.start)} - ${ftime(e.end)}`;
      return e;
    });
  });

  const byDay = (day) => {
    if (day == "*") return all.value;
    var _events = _.sortBy(
      events.value.filter((e) => e.day == day),
      (e) => e.start
    );
    var r = [];
    var matin = [];
    var pm = [];
    var soir = [];
    _events.forEach((e) => {
      var H = e.start.split(":")[0];
      if (H < 12) {
        matin.push(e);
      } else if (H <= 18) {
        pm.push(e);
      } else {
        soir.push(e);
      }
    });
    if (matin.length) {
      r.push({ header: true, name: "Matin", dense: true });
      r = r.concat(matin);
    }
    if (pm.length) {
      r.push({ header: true, name: "Après-midi", dense: true });
      r = r.concat(pm);
    }
    if (soir.length) {
      r.push({ header: true, name: "Soirée", dense: true });
      r = r.concat(soir);
    }
    return r;
  };

  // Returns the info for the given tab
  const info = computed(() => {
    return (name) => {
      var tab = infoSrc.value.find((i) => i.tab == name);
      return tab ? tab.content : "";
    };
  });

  const video = computed(() => {
    return (name) => {
      var tab = infoSrc.value.find((i) => i.tab == name);
      return tab ? tab.video : true;
    };
  });

  const categoryInfo = computed(() => {
    return (cat) => {
      return classes.value[cat] || {};
    };
  });

  const currentActiveEvent = computed(() => {
    return eventsList.value.find((e) => e.active);
  });

  const currentEvent = computed(() => {
    return eventsList.value.find((e) => e.id == currentEventId.value) || {};
  });

  watch(currentEventId, () => {
    console.log("Current active event:", currentEventId.value);
    fetchPlanning();
    fetchInfo();
  });

  const fetchEvents = async () => {
    console.log("Updating events");
    const { data } = await supabase.from("holygames-planning-events").select();
    console.log(data);
    eventsList.value = _.sortBy(data, "start");
    currentEventId.value = data.find((e) => e.active).id;
  };

  const fetchPlanning = async () => {
    if (!currentActiveEvent.value) {
      console.log("fetchPlanning: No active event set.");
      return;
    }
    console.log("Updating activities for event ", currentEventId.value);
    const { data } = await supabase
      .from("holygames-planning-activities")
      .select()
      .eq("event", currentEventId.value);
    eventsSrc.value = data;
  };
  const fetchInfo = async () => {
    if (!currentActiveEvent.value) {
      console.log("fetchInfo: No active event set.");
      return;
    }
    console.log("Updating info for event ", currentEventId.value);
    const { data } = await supabase
      .from("holygames-planning-info")
      .select()
      .eq("event", currentEventId.value);

    infoSrc.value = data;
  };

  const dayRange = (start, end) => {
    return date.getDateDiff(end, start, "days") + 1;
  };

  const daysNames = (start, end) => {
    const NAMES = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    var s = date.formatDate(start, "d");
    s = parseInt(s);
    var r = [];
    for (var i = 0; i < dayRange(start, end); i++) {
      r.push(NAMES[(s + i) % 7]);
    }
    return r;
  };

  const days = computed(() => {
    return daysNames(currentEvent.value.start, currentEvent.value.end);
  });

  return {
    user,
    eventsList,
    eventsSrc,
    infoSrc,
    video,
    currentEventId,
    days,
    categories,
    classes,
    admin,
    srcById,
    all,
    byDay,
    events,
    info,
    categoryInfo,
    currentActiveEvent,
    fetchPlanning,
    fetchEvents,
    fetchInfo,
    dayRange,
    daysNames,
    currentEvent,
    checkAdmin,
  };
});
