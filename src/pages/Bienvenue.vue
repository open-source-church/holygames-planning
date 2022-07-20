<template>
  <q-page class="bg-yellow content column full-height">
    <q-tab-panels v-model="tab" animated class="col column">
      <q-tab-panel name="accueil">
        <div v-html="bienvenue" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="info">
        <div v-html="info" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="jeux">
        <div v-html="jeux" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="kids">
        <div v-html="kids" class="q-mb-xl" />
      </q-tab-panel>
      <q-tab-panel name="salles">
        <div v-html="salles" class="q-mb-xl" />
      </q-tab-panel>
    </q-tab-panels>
    <q-separator />
    <q-page-sticky expand position="bottom" class="bg-purple">
      <q-tabs
        v-model="tab"
        dense
        class="bg-purple text-white"
        align="justify"
        narrow-indicator
      >
        <q-tab name="accueil" label="Bienvenue" icon="favorite" />
        <q-tab name="info" label="Infos" icon="info" />
        <q-tab name="jeux" label="Jeux" icon="casino" />
        <q-tab name="kids" label="Enfants" icon="child_care" />
        <q-tab name="salles" label="Salles" icon="location_on" />
      </q-tabs>
    </q-page-sticky>
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
    var bienvenue = `
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

    var info = `À venir…`;
    var jeux = `À venir…`;
    var kids = `À venir…`;
    var salles = `#### Salles

Plusieurs salles de l’hôtel seront utilisées pour de nombreuses choses. Il se peut que certains changements aient lieu, si c’est le cas ce sera annoncé sur les groupes (whatsapp / telegram), sur les feuilles dans la salle de jeu, et dans l’application. Les salles principales:

<img src="https://www.classic-hotel.ch/sites/default/files/pictures/plan_salles.jpg" class="full-width" />

##### Côté Restaurant

**Beethoven / Mozart:** les salles de jeux, sous la réception. Points de rendez-vous pour toutes choses ludiques, et lieu d’information et inscription !

**Bach / Brahms / Vivaldi / Verdi:** Juste à côté de la salle de jeux. Utilisées prioritairement pour les enfants.

**Schubert:** Derrière la réception, près du restaurant. Utilisée pour du jdr, des temps spi, etc.

**Restaurant:** au-dessus des salles de jeux, à côté de la réception. On utilise principalement cette salle pour se sustenter, et ça fonctionne assez bien.

**Les espaces de l'hôtel autour de la réception:** canapés, bar. On peut les utiliser pour se rencontrer, y faire un jeu (en ramenant bien tout le matériel), dans le respect des autres clients de l’hôtel.

##### Côté chambres

**Chopin:** à l’entrée à gauche du bâtiment des chambres, équipée d’une mini cuisine mais dont on ne peut se servir que pour faire bouillir de l’eau. Principalement utilisée pour les activités enfants en journée et le soir.

**Bizet:** une salle intime dans la montée vers les chambres. Principalement utilisée pour des temps calmes et activités spi.

**Bunker:** au sous-sol sous les chambres. Un espace sombre et lugubre pour des parties de JDR terrifiantes, ou pour stocker les ados.`;

    bienvenue = marked.parse(bienvenue);
    info = marked.parse(info);
    kids = marked.parse(kids);
    jeux = marked.parse(jeux);
    salles = marked.parse(salles);
    var tab = ref("accueil");
    return { bienvenue, info, kids, jeux, salles, tab };
  },
});
</script>

<style lang="scss">
.content {
  strong {
    color: #800080;
  }
  h4,
  h5 {
    margin: 0.5em 0;
    color: #800080;
  }
}
</style>
