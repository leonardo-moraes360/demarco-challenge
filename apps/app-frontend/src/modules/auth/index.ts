import { type RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/common/layouts/Default.vue";
import AuthView from "./views/Auth.vue";

export * from "./stores/auth";

export const authRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: DefaultLayout,
    children: [
      {
        name: "login",
        path: "",
        component: AuthView,
      },
    ],
  },
];
