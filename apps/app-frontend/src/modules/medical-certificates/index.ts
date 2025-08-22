import { type RouteRecordRaw } from "vue-router";
import MainLayout from "@/common/layouts/Main.vue";

export * from "./stores/medical-certificates";

export const medicalCertificateRoutes: RouteRecordRaw[] = [
  {
    path: "/medical-certificates",
    component: MainLayout,
    children: [
      {
        name: "medical-certificates",
        path: "",
        component: () => import("./views/MedicalCertificates.vue"),
      },
    ],
  },
];
