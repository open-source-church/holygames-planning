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

    var info = `#### Horaires et infos utiles

Cette semaine se veut libre. On se lève quand on veut, on profite de jouer ou de se détendre, on rencontre des gens qui partagent une passion ou l’autre. Il n’y a ni programme fixe, ni horaire, à la seule exception de la **plénière d’accueil (dimanche 16h30)**, et la **plénière d’expulsion (vendredi 11h)**, une trentaine de minutes seulement, dans la salle de jeux,  pour commencer et terminer joyeusement la semaine ensemble, et des repas.

**Apéro de bienvenue :** pour bien commencer, un apéro pour toutes et tous, lundi soir (deuxième soir), à 17h à la salle Chopin.

**Heures des repas :** petit-déjeuner buffet entre 7h et 10h, souper de 18h à 20h30. Les repas de midi sont à notre charge (pique-nique).

**Boissons et afters :** le bar de l'hôtel est ouvert jusqu'à 22h. Un frigo est mis à notre disposition pour stocker quelques boissons à vous, et aliments pour bébés.

**Bains :** un accès gratuit à la piscine du village, et accès au bain/SPA de l’Hôtel Central pour le prix de 3.-/personnes.

**Communication des activités :** des groupes whatsapp/telegram ont été créés pour faciliter la communication des différentes activités pendant la semaine. Tous les liens et détails : www.holygames.ch/groupes.

Et parce qu’on vous aime beaucoup, une [**application web**](https://horaires.holygames.ch) avec les infos utiles, horaires des activités et détails est disponible. Elle sera mise à jour pendant la semaine.


**Jeux :** accès libre tout au long de la semaine dans la salle de jeux. Certaines parties organisées ont un horaire : merci d’être ponctuels pour ne pas retarder les autres. Détails ci-dessous.

**Activités :** Vous trouverez ici un descriptif des activités que nous vous avons concoctées avec plaisir. Pour vous inscrire, si nécessaire, faites-le sur le panneau d’affichage dans la salle de jeux.

La participation à toutes les activités est absolument libre, facultative et optionnelle. Holygames décline toute responsabilité en cas de croissance, épanouissement ou bénédiction qui en résulterait.

**Panneau d’activités :** un panneau avec des petites fiches est disponible dans la salle de jeu pour proposer des activités: parties de jeux, ballades, apéro, temps spi, tout ce que vous voulez. N’hésitez pas à vous en servir, c’est une manière de contribuer à la qualité de la semaine !

**Déguisements:** déguisements sur le thème “utopie / dystopie” bienvenus toute la semaine :)

**Fin officielle :** plénière d’adieux à 11h vendredi dans la salle de jeux, puis fin officielle à 15h (libération des chambres à 11h, possibilité de laisser des enfants affaires à la réception).`;

    var jeux = `#### Jeux de société

**Salle de jeux:** vous pouvez mettre à disposition les jeux que vous avez apportés dans la salle de jeux, pour le plus grand bonheur de tout le groupe. Il y aura des tables pour classer les jeux par catégories, et de quoi marquer votre nom sur vos jeux (sans laisser de traces). Gardez une liste (ou une photo) de vos jeux pour faciliter la fin de la semaine. Veuillez traiter les jeux des autres avec toute la révérence que ces objets quasi-sacrés méritent ! Une longue partie peut rester en suspens, mais après utilisation merci de ranger minutieusement chaque jeu. Les enfants sont admis dans la salle de jeux sous la responsabilité de leurs parents.

Des centaines de *parties spontanées* auront lieu tout au long de la semaine. Traînez dans la salle de jeux, discutez un peu avec des gens, et vous vous retrouverez bien vite à une table, à découvrir ou à expliquer un jeu. **Merci à chacun et chacune de veiller à intégrer autant que possible les uns et les autres.**

Pour aider *l’organisation de parties*, des formulaires seront à disposition pour proposer des parties (jeu, infos pratiques), ou vous y inscrire. C’est un très bon moyen de rencontrer des gens, ou découvrir des jeux.

#### Jeux transversaux

##### Méga Méta Jeu

Un meta-jeu se déroulera tout au long de la semaine. Chaque jour, de nouvelles quêtes seront proposées, nous permettant de gagner des XP (points d’expériences) et d’affronter des quêtes de plus haut niveaux.

Si suffisamment de quêtes sont réussies par l’ensemble du groupe, peut-être que le dragon de fer sortira jeudi de sa tanière, et les plus braves d’entre nous pourront l’affronter et gagner quelques trésors !
Tous les détails et règles sont dans la salle de jeux. En cas de questions: Ambre (079 575 12 74).

##### Jeu Social

Un petit jeu “d’identité secrète” pour lancer la semaine !

<img src="https://i2.paste.pics/5f659fff53914040eae822538a74f939.png" class="full-width" />

À l’accueil, vous aurez l’occasion si vous l’acceptez de remplir une petite fiche avec votre date de naissance et lieu d’habitation. Lundi matin, viens tirer un billet, ta quête sera de découvrir qui est la personne avec l’âge et le lieu d’habitation correspondant. Une fois votre cible trouvée, inscris son nom et le tien au verso du billet et rapporte-le à Damaris (078 644 68 37).

Tu recevras des XP pour le Méta-jeux selon ton classement, alors sois rapide ! Bonne quête à toi !

##### GrattiCartes

Vous avez normalement reçu une [GratiCarte](https://www.open-source.church/2022/05/graticartes-holygames-des-cartes-%C3%A0-s%C3%A9changer-pour-sentrainer-%C3%A0-la-gratitude-serious-game/) à votre arrivée à l’hôtel. Il s’agit d’un “jeu” pour pratiquer la gratitude, la reconnaissance, s’entraîner à dire “merci”. Si vous le souhaitez, vous pouvez la donner à quelqu’un pendant la semaine en lui expliquant pourquoi vous souhaitez la remercier.

Si votre carte ne vous inspire pas, ou que vous en voulez plus, vous pouvez l’échanger ou en prendre d’autres à la salle de jeux ou dans la salle Bizet.

<div class="text-center">

![](https://i2.paste.pics/4cbe8a2386b275616b4d9e06c02bd3a7.png)

</div>

`;

    var kids = `#### Groupes d’enfants

Nous avons organisé trois groupes d'enfants avec plusieurs moniteurs et monitrices chacun :

- 0-2 ans : *Florence* (079 705 74 87), salles *Bach* et *Brahms*
- 3-5 ans : *Salomé* (078 757 80 97),  salles *Vivaldi* et *Verdi*
- 6-10 ans : *Maëlle* (076 682 31 66), salle *Chopin*

Une formidable équipe motivée et expérimentée a préparé un super programme pour vos enfants !

Celui-ci comprend beaucoup de temps en extérieur. Merci d'amener votre enfant au groupe avec un sac comprenant : casquette, crème solaire, maillot de bain, petit linge, k-way, bonnes chaussures et une gourde remplie avec son nom. Les 10h et le repas du mardi sont fournis par les animateurs du groupe.

Comme il s’agit d’un séjour jeux et spiritualité, nous proposons aux enfants une animation spirituelle pour leur mettre à disposition quelques "perles" tirées de la tradition chrétienne. Cette animation est organisée avec soin et respectueuse de la liberté de croyance de chacun.  Cette année nous explorerons des thèmes comme la différence, l'égalité, la justice, la compassion, le courage.

Nous nous réjouissons de partager ces beaux moments avec vos enfants!

##### Horaires

- Lundi : 9h-12h
- Mardi : 9h-17h
- Jeudi : 9h-12h
- Vendredi : 9h-11h

##### Quelques mots sur la journée du mardi 🎉

De 9h à 17h les animateurs entourent les enfants avec un super programme :

- **0-2 ans :** balade jusqu'à la *chèvrerie* de la famille Perreten. *Visite* de la chèvrerie, *pique-nique* puis *sieste* près du parc à *biches*. Puis retour en bus. (repas et collations fournis par le groupe)

- **3-10 ans :** *Enigme géante* dans Leysin en groupe (accompagné de moniteurs) et *repas tous ensemble autour du feu* à midi dans la forêt à côté de l'arrêt Tresseleire. Suite et fin de l'enquête. (Repas et collations fournis par le groupe)

##### Soirées

Pour les soirées de lundi, mercredi et jeudi, Holygames organise deux heures de prise en charge des enfants par des moniteurs. Une feuille d'inscription sera scotchée devant la salle Chopin où vous pourrez inscrire vos enfants le lundi, mercredi et jeudi soir, soit :

- À une animation de 19h-21h (jeux, film, histoire, balade). Rdv : salle Chopin à 19h.
- À être surveillés lors de leur sommeil de 20h-22h pour que vous puissiez profiter d'un bout de soirée (inscrire n° de chambre, tél). Possibilité de négocier avec les moniteurs s'ils sont d'accord de veiller plus longtemps 😉

Contact pour tout ce qui concerne les enfants : Laurence (076 251 63 84).

*Les enfants restent sous la responsabilité juridique de leurs parents pendant toute la semaine.*


#### Ados (~11-20 ans)

Des activités pour les ~11-20ans seront proposées et réparties sur la semaine. Un petit panneau d'affichage dans la salle de jeu principale indiquera les prochains RDV. Ces activités seront ouvertes à toutes et tous, facultatives, et potentiellement improvisées.

Elles s'adressent aux jeunes, mais sont ouvertes à n’importe qui. *Les activités seront improvisées selon les envies du moment, d’où l’importance du panneau !*

Par exemple:

- Loup Garou / Premier contact
- Initiation JdR
- Balade voyage du héros

Responsables : Alexandre (077 421 49 17) et Valentin (079 270 86 53).
`;
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
  strong,
  em {
    color: #800080;
  }
  h4,
  h5 {
    margin: 0.5em 0;
    color: #800080;
  }
}
</style>
