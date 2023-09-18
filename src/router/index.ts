import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/Login.vue"), // Thay đổi đường dẫn và component tương ứng
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import("../components/Navbar.vue"), // Thay đổi đường dẫn và component tương ứng
  },
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
    path: "/user/search/:username?",
    name: "user-search",
    component: () => import("../components/userList.vue"), // Component cho trang tìm kiếm
    props: (route) => ({ username: route.params.username || '' })
  }  
  
];

console.log(process.env.BASE_URL);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
