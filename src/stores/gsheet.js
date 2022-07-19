import { defineStore } from "pinia";
import { _ } from "lodash";
import { marked } from "marked";

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
      return (day) =>
        _.sortBy(
          state.data.filter((e) => e.Day == day),
          (e) => e.TimeStart
        );
    },
  },

  actions: {
    async getData() {
      if (this.data.length || this.loading) return;
      console.log("We get the data");
      this.loading = true;
      var url =
        "https://opensheet.elk.sh/1l-TeRXFxZ47SudA7At3ClGEEYW8x_lIqkgNZj-f0hq8/2022-07";
      this.data = await fetch(url)
        .then((result) => result.json())
        .then((output) => {
          output.forEach((e) => {
            e.Description = marked.parse(e.Description || "");
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
          console.log("Output: ", output);
          return output;
        })
        .catch((err) => console.error(err));
      this.loading = false;
    },
  },
});
