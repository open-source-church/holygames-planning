<template>
  <q-page padding>
    <div class="content" v-html="content" />
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed } from "vue";
import { usegSheet } from "stores/gsheet";
import { _ } from "lodash";
import { marked } from "marked";

export default defineComponent({
  name: "DayPage",
  props: ["day"],
  setup(props) {
    var content = `
#### Bienvenue

Bienvenue à la première semaine holygames ! Nous avons créé holygames pour nous ressourcer. C’est donc la **mission principale** de chacun·e pour cette semaine : se faire du bien.

Nous sommes heureux de pouvoir nous retrouver autour de deux de nos **passions**: les jeux, et la spiritualité chrétienne. À vous maintenant la liberté que vous offre la structure holygames pour profiter avec nous de l’une ou l’autre — ou les deux — de ces passions !

Nous voulons vivre cette semaine dans la **bienveillance** et l’**accueil** de chacun·e. Merci de privilégier les nouvelles connaissances, à table comme autour d’un plateau de jeu, et l’ouverture et le respect envers les passions des uns et des autres.

Vous trouverez dans ce feuillet différentes informations utiles pour le bon déroulement du programme.

**Pour toute question au sujet de l'infrastructure, des chambres, etc. :** contactez directement l'hôtel.

Pour le reste nous sommes des participants comme les autres, venus jouer et se détendre. Essayez de trouver en premier lieu des solutions responsables entre vous. Mais nous restons à votre disposition pour que chacun·e passe une merveilleuse semaine.

**Ludiquement,** \\
*Rita, Ambre & Olivier,* \\
*Le comité* \\
*Le staff* \\
*Et un million d’autres qui contribuent d’un million de façons,
merci à chacun·e !*
    `;

    content = marked.parse(content);
    return { content };
  },
});
</script>

<style lang="scss">
.content {
  strong {
    color: #800080;
  }
  h4 {
    margin: 0.5em 0;
    color: #800080;
  }
}
</style>
