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

      // children: [
      //   {
      //     path: "/user-athletes/edit/:id",
      //     name: "user-athletes-edit",
      //     component: () => import("../view/UserAthletesUpdate.vue"),
      //   },
      // ],
    },

    {
      path: "/create-user-athletes",
      name: "Athletes",
      component: () => import("../view/UserAthletes.vue"),
    },

    {
      path: "/user-athletes/edit/:id",
      name: "user-athletes-edit",
      component: () => import("../view/UserAthletesUpdate.vue"),
    },

    {
      path: "/create-user-trener",
      name: "Trener",
      component: () => import("../view/UserTrener.vue"),
    },

    {
      path: "/user-trainer/edit/:id",
      name: "user-trainer-edit",
      component: () => import("../view/UserTrenerUpdate.vue"),
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
      path: "/school-app",
      name: "School-app",
      redirect: { name: "school-list" },

      children: [
        {
          path: "/school-list",
          name: "school-list",
          component: () => import("../view/School.vue"),
        },
        {
          path: "/school/create",
          name: "school-create",
          component: () => import("../components/School/SchoolCreate.vue"),
        },
        {
          path: "/school/edit/:id",
          name: "school-edit",
          component: () => import("../components/School/SchoolEdit.vue"),
        },
      ],
    },

    {
      path: "/sportsman-view/:id",
      name: "PlayerView",
      component: () => import("../view/PlayerProfile.vue"),
    },
    {
      path: "/trainer-view/:id",
      name: "TrainerView",
      component: () => import("../view/TrainerProfile.vue"),
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
