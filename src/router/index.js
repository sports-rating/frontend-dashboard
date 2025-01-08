import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../view/Dashborad.vue"),
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: "/create-user-athletes",
      name: "Athletes",
      component: () => import("../view/UserAthletes.vue"),
    },
    {
      path: "/create-user-trener",
      name: "Trener",
      component: () => import("../view/UserTrener.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../view/Login.vue"),
    },
    {
      path: "/password",
      name: "Password",
      component: () => import("../view/Password.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../view/Profile.vue"),
    },
    {
      path: "/applications-for-registration",
      name: "Applications",
      component: () => import("../view/Applications.vue"),
    },
    {
      path: "/foundation",
      name: "Foundation",
      component: () => import("../view/Foundation.vue"),
    },
    {
      path: "/found-id",
      name: "FoundId",
      component: () => import("../view/FoundId.vue"),
    },

    {
      path: "/complexes",
      name: "Complexes",
      component: () => import("../view/Complexes.vue"),
    },
    {
      path: "/tournament-app",
      name: "Tournamenta-app",
      redirect: { name: "tournament-list" },

      children: [
        {
          path: "/tournament-list",
          name: "tournament-list",
          component: () => import("../view/Tournament.vue"),
        },
        {
          path: "/tournament/create",
          name: "tournament-create",
          component: () =>
            import("../components/Tournament/TournamentCreate.vue"),
        },
        {
          path: "/tournament/edit/:id",
          name: "tournament-edit",
          component: () =>
            import("../components/Tournament/TournamentEdit.vue"),
        },
      ],
    },

    {
      path: "/sport-app",
      name: "sport-app",
      redirect: { name: "sport-list" },

      children: [
        {
          path: "/sport-list",
          name: "sport-list",
          component: () => import("../view/Sport.vue"),
        },
        {
          path: "/sport/create",
          name: "sport-create",
          component: () => import("../components/Sport/SportCreate.vue"),
        },
        {
          path: "/sport/edit/:id",
          name: "sport-edit",
          component: () => import("../components/Sport/SportEdit.vue"),
        },
      ],
    },

    {
      path: "/player-id",
      name: "PlayerId",
      component: () => import("../view/PlayerProfile.vue"),
    },

    {
      path: "/biography-player",
      name: "biographyPlayer",
      component: () => import("../view/BiographyPlayer.vue"),
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("../view/NotFound.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!!isAuthenticated) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
