import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    alias: "/user",
    name: "user",
    component: () => import("../components/userList.vue"),
  },
  {
    path: "/user/new",
    name: "user-new",
    component: () => import("../components/userForm.vue"),
  },
  {
    path: "/user/:id",
    name: "user-details",
    component: () => import("../components/userDetail.vue"),
  },
  {
    path: "/login", // Đường dẫn cho trang đăng nhập
    name: "login", // Tên của tuyến
    component: () => import("../components/Login.vue"), // Đường dẫn đến Component Login
  },
];

console.log(process.env.BASE_URL);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
