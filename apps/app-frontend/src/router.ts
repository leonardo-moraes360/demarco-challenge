import { createRouter, createWebHistory } from "vue-router";
import { authRoutes, authStore } from "@/modules/auth";
import { homeRoutes } from "@/modules/home";
import { userRoutes } from "@/modules/users";
import { medicalCertificateRoutes } from "@/modules/medical-certificates";

export const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      name: "fallback",
      redirect: "/login",
    },
    ...authRoutes,
    ...homeRoutes,
    ...userRoutes,
    ...medicalCertificateRoutes,
  ],
});

router.beforeEach(async (to, _from, next) => {
  const auth = authStore();

  if (to.path === "/login" && auth.isAuthenticated) {
    return next("/");
  }

  if (!auth.isAuthenticated && to.path !== "/login") {
    return next("/login");
  }

  if (auth.isAuthenticated) {
    return next();
  }

  if (to.path === "/login") {
    return next();
  }

  return next("/login");
});
