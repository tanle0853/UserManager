import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    alias: "/user",
    name: "user",
    component: () => import("../components/userList.vue"),
  },
  {
    path: "/",
    alias: "/user/new",
    name: "user-new",
    component: () => import("../components/userForm.vue"),
  },
  {
    path: "/",
    alias: "/user/:id",
    name: "user-details",
    component: () => import("../components/userDetail.vue"),
  },
];

console.log(process.env.BASE_URL);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
