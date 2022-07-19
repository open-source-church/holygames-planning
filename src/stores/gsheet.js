import { defineStore } from "pinia";

export const usegSheet = defineStore("gSheet", {
  state: () => ({
    data: null,
  }),

  getters: {
    theData(state) {
      this.getData();
      return state.data;
    },
  },

  actions: {
    async getData() {
      if (this.data) return;
      console.log(this.data);
      console.log("We get the data");
      var url =
        "https://opensheet.elk.sh/1l-TeRXFxZ47SudA7At3ClGEEYW8x_lIqkgNZj-f0hq8/2022-07";
      this.data = await fetch(url)
        .then((result) => result.json())
        .then((output) => {
          console.log("Output: ", output);
          return output;
        })
        .catch((err) => console.error(err));
      console.log(this.data);
    },
    async getFramagenda() {
      var url =
        "https://framagenda.org/remote.php/dav/calendars/theologeek/holygames/";
      // const client = await createDAVClient({
      //   serverUrl: url,
      // });
      // console.log(client);
    },
  },
});
