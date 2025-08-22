import { type RouteRecordRaw } from "vue-router";
import MainLayout from "@/common/layouts/Main.vue";

export * from "./stores/users";

export const userRoutes: RouteRecordRaw[] = [
  {
    path: "/users",
    component: MainLayout,
    children: [
      {
        name: "users",
        path: "",
        component: () => import("./views/Users.vue"),
      },
    ],
  },
];
