import { defineStore, setMapStoreSuffix } from "pinia";
import { _ } from "lodash";
import { marked } from "marked";
import { supabase } from "../supabase";
import { date } from "quasar";

export const useGlobal = defineStore("global", {
  state: () => ({
    user: null,
    eventsSrc: [],
    infoSrc: [],
    days: [
      // "Dimanche",
      // "Lundi",
      // "Mardi",
      // "Mercredi",
      // "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ],
    categories: [
      "Hotel",
      "RDV",
      "Spi",
      "JDR",
      "Repas",
      "Kids",
      "Jeu",
      "Nature",
    ],
    classes: {
      Hotel: {
        icon: "hotel",
        color: "red",
        classes: "bg-red-1 text-red-10",
        name: "Hôtel"
      },
      RDV: {
        icon: "groups",
        color: "red",
        classes: "bg-red-1 text-red-10",
        name: "Rendez-vous"
      },
      Spi: {
        icon: "local_fire_department",
        color: "purple",
        classes: "bg-purple-1 text-purple-10",
        name: "Activités spi et bienfaisantes"
      },
      JDR: {
        icon: "casino",
        color: "amber",
        classes: "bg-amber-1 text-amber-10",
        name: "Jeux de rôles"
      },
      Repas: {
        icon: "hotel",
        color: "brown",
        classes: "bg-brown-1 text-brown-10",
        name: "Repas"
      },
      Kids: {
        icon: "child_care",
        color: "cyan",
        classes: "bg-cyan-1 text-cyan-10",
        name: "Enfance"
      },
      Jeu: {
        icon: "extension",
        color: "lime",
        classes: "bg-lime-1 text-lime-10",
        name: "Jeux"
      },
      // Nature: {
      //   icon: "eco",
      //   color: "light-green",
      //   classes: "bg-light-green-1 text-light-green-10",
      // },
    },
  }),

  getters: {
    admin: (state) =>
      state.user &&
      [
        "fdf346ea-bafb-464f-9efd-9aa267392902",
        "07d80885-6e51-4e12-bb02-7ff968bc2321",
        "a8c611ae-ddb0-4b5b-b4e7-946354a9b673",
      ].includes(state.user.id),
    srcById(state) {
      console.log(state.eventsSrc);
      return (id) => state.eventsSrc.find((e) => e.id == id);
    },
    all(state) {
      var all = [];
      this.days.forEach((d) => {
        var day = this.byDay(d);
        if (day.length) {
          all.push({ header: true, name: d });
          all = all.concat(day);
        }
      });
      return all;
    },
    activeDays(state) {
      return state.days.filter((d) => this.byDay(d).length);
    },
    byDay(state) {
      return (day) => {
        if (day == "*") return this.all;
        var events = _.sortBy(
          this.events.filter((e) => e.day == day),
          (e) => e.start
        );
        var r = [];
        var matin = [];
        var pm = [];
        var soir = [];
        events.forEach((e) => {
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
    },
    events(state) {
      return state.eventsSrc.map((ev) => {
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
    },
    info(state) {
      return (name) => {
        var tab = state.infoSrc.find((i) => i.tab == name);
        return tab ? tab.content : "";
      };
    },
    categoryInfo(state) {
      return (cat) => {
        return state.classes[cat] || {};
      };
    },
  },

  actions: {
    async fetchPlanning() {
      console.log("Updating data");
      const { data } = await supabase
        .from("holygames-planning-2023-07")
        .select();

      this.eventsSrc = data;
    },
    async fetchInfo() {
      console.log("Updating info");
      const { data } = await supabase.from("holygames-info-2023-07").select();

      this.infoSrc = data;
    },
  },
});
