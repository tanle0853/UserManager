import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import 'bootswatch/dist/cerulean/bootstrap.min.css'

const app = createApp(App);
app.use(router);

// Hàm kiểm tra người dùng đã đăng nhập hay chưa

function isUserLoggedIn() {
  const userToken = localStorage.getItem("userToken");
  return userToken !== null;
}

// Chuyển hướng đến trang đăng nhập khi mở ứng dụng
router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !isUserLoggedIn()) {
    next({ name: "Login" });
  } else {
    next();
  }
});

app.mount("#app");
