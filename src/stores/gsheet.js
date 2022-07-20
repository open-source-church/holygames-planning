import { defineStore } from "pinia";
import { _ } from "lodash";
import { marked } from "marked";
import { date } from "quasar";

export const usegSheet = defineStore("gSheet", {
  state: () => ({
    data: [],
    loading: false,
  }),

  getters: {
    theData(state) {
      this.getData();
      return state.data;
    },
    days(state) {
      return _.uniqBy(state.data, "Day").map((e) => e.Day);
    },
    byDay(state) {
      return (day) => {
        if (day == "*") return this.all;
        var events = _.sortBy(
          state.data.filter((e) => e.Day == day),
          (e) => e.TimeStart
        );
        var r = [];
        r.push({ header: true, Name: "Matin", dense: true });
        var pm = false;
        var evening = false;
        events.forEach((e) => {
          var H = e.TimeStart.split(":")[0];
          if (H > 12 && !pm) {
            r.push({ header: true, Name: "Après-midi", dense: true });
            pm = true;
          }
          if (H >= 18 && !evening) {
            r.push({ header: true, Name: "Soirée", dense: true });
            evening = true;
          }
          r.push(e);
        });
        return r;
      };
    },
    all(state) {
      var all = [];
      this.days.forEach((d) => {
        all.push({ header: true, Name: d });
        this.byDay(d).forEach((e) => all.push(e));
      });
      return all;
    },
    categories(state) {
      var cat = {};
      this.data.forEach((e) => {
        if (!(e.Category in Object.keys(cat))) {
          cat[e.Category] = {
            icon: e.Icon,
            color: e.Color,
            classes: e.Classes,
          };
        }
      });
      return cat;
    },
  },

  actions: {
    async getData() {
      if (this.data.length || this.loading) return;
      this.loading = true;
      var url =
        "https://opensheet.elk.sh/1l-TeRXFxZ47SudA7At3ClGEEYW8x_lIqkgNZj-f0hq8/2022-07";
      this.data = await fetch(url)
        .then((result) => result.json())
        .then((output) => {
          output = output.filter((e) => e.Category);
          output.forEach((e) => {
            if (e.Description) {
              e.Description =
                e.Description +
                "\n\n**Rendez-vous:** " +
                e.Place +
                " à " +
                e.TimeStart;
              if (e.Contact)
                e.Description = e.Description + "\n\n**Contact:** " + e.Contact;
              e.Description = marked.parse(e.Description || "");
            }
            e.time = `${e.TimeStart} - ${e.TimeEnd}`;
            e.Icon = {
              Hotel: "hotel",
              RDV: "groups",
              Spi: "local_fire_department",
              Repas: "restaurant",
              JDR: "casino",
              Jeu: "extension",
              Outdoor: "eco",
              Kids: "child_care",
            }[e.Category];
            e.Color = {
              Hotel: "red",
              RDV: "red",
              Spi: "purple",
              Repas: "brown",
              JDR: "amber",
              Jeu: "lime",
              Outdoor: "light-green",
              Kids: "cyan",
            }[e.Category];
            e.Classes = {
              Hotel: "bg-red-1 text-red-10",
              RDV: "bg-red-1 text-red-10",
              Spi: "bg-purple-1 text-purple-10",
              Repas: "bg-brown-1 text-brown-10",
              JDR: "bg-amber-1 text-amber-10",
              Jeu: "bg-lime-1 text-lime",
              Outdoor: "bg-light-green-1 text-light-green-10",
              Kids: "bg-cyan-1 text-cyan-10",
            }[e.Category];
          });
          return output;
        })
        .catch((err) => console.error(err));
      this.loading = false;
    },
  },
});