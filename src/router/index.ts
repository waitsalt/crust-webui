import { createRouter, createWebHashHistory, } from "vue-router";
import StorageView from "@/view/StorageView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/:path(.*)",
      name: "存储",
      component: StorageView,
    },
  ],
});

export default router;
