const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "fiches", component: () => import("pages/FichesPage.vue") },
      {
        path: ":day/:index?",
        component: () => import("pages/DayPage.vue"),
        props: true,
      },
      { path: "bienvenue", component: () => import("pages/Bienvenue.vue") },
      {
        path: "chevalier/:realtime?",
        component: () => import("src/pages/ChevalierPage.vue"),
        props: true,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
