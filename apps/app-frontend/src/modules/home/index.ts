import { type RouteRecordRaw } from "vue-router";
import MainLayout from "@/common/layouts/Main.vue";

export * from "./stores/dashboard";

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        name: "home",
        path: "",
        component: () => import("./views/Home.vue"),
      },
    ],
  },
];
