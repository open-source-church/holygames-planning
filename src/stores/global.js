import { defineStore, setMapStoreSuffix } from "pinia";
import { _ } from "lodash";
import { marked } from "marked";
import { supabase } from "../supabase";
import { date } from "quasar";
import { ref, computed } from "vue";

export const useGlobal = defineStore("global", () => {
  const user = ref(null);

  // List of all holygames events
  const eventsList = ref([]);
  const eventsSrc = ref([]);
  const infoSrc = ref([]);
  // Id of the currently display event
  const currentEventId = ref(null);
  const days = ref([
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    // "Samedi",
    // "Dimanche",
  ]);

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

  const admin = computed(
    () =>
      user.value &&
      [
        "fdf346ea-bafb-464f-9efd-9aa267392902",
        "07d80885-6e51-4e12-bb02-7ff968bc2321",
        "a8c611ae-ddb0-4b5b-b4e7-946354a9b673",
      ].includes(user.value.id)
  );

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

  const activeDays = computed(() => {
    return days.value.filter((d) => byDay(d).length);
  });

  const info = computed(() => {
    return (name) => {
      var tab = infoSrc.value.find((i) => i.tab == name);
      return tab ? tab.content : "";
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

  const fetchPlanning = async () => {
    console.log("Updating data");
    const { data } = await supabase.from("holygames-planning-2023-07").select();
    eventsSrc.value = data;
  };
  const fetchEvents = async () => {
    console.log("Updating events");
    const { data } = await supabase.from("holygames-planning-events").select();
    console.log(data);
    eventsList.value = _.sortBy(data, "start");
    currentEventId.value = data.find((e) => e.active).id;
  };
  const fetchInfo = async () => {
    console.log("Updating info");
    const { data } = await supabase.from("holygames-info-2023-07").select();

    infoSrc.value = data;
  };

  return {
    user,
    eventsList,
    eventsSrc,
    infoSrc,
    currentEventId,
    days,
    categories,
    classes,
    admin,
    srcById,
    all,
    activeDays,
    byDay,
    events,
    info,
    categoryInfo,
    currentActiveEvent,
    fetchPlanning,
    fetchEvents,
    fetchInfo,
  };
});
