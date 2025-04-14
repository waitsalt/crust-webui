import { createRouter, createWebHistory } from "vue-router";
import StorageView from "@/view/StorageView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:path(.*)",
      name: "存储",
      component: StorageView,
    },
  ],
});

export default router;
