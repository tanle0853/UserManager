<template>
  <div class="col-md-4 offset-4">
    <div class="card card-body">
      <h1 class="card-title my-3 text-center">Đăng nhập</h1>
      <form @submit.prevent="login">
        <input
          class="form-control mb-3"
          placeholder="Tên đăng nhập"
          type="text"
          v-model="username"
          autofocus
        />
        <input
          type="password"
          class="form-control mb-3"
          placeholder="Mật khẩu"
          v-model="password"
        />
        <!-- Display error message if loginError is not empty -->
        <p v-if="loginError" class="text-danger">{{ loginError }}</p>

        <button
          class="btn btn-primary w-100"
          :disabled="!username || !password || loading"
        >
          {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted} from "vue";
import { loginUser } from "@/services/userService";
import { useRouter } from "vue-router";
import { AxiosResponse } from "axios"; // Thêm dòng này

export default defineComponent({
  setup() {
    const router = useRouter();
    const username = ref("");
    const password = ref("");
    const loading = ref(false);
    const loginError = ref("");
    // Kiểm tra nếu đã đăng nhập, chuyển hướng đến trang home
    onMounted(() => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      if (userData && userData.token) {
        router.push("/user"); // Thay đổi "/home" thành đường dẫn trang chính của bạn
      }
    });
    const login = async () => {
      try {
        loading.value = true;
        loginError.value = "";

        const loginData = {
          username: username.value,
          password: password.value,
        };

        const response: AxiosResponse<any> = await loginUser(loginData);

        console.log(response);

        if (response.status === 200) {
          // Lưu token vào localStorage
          localStorage.setItem("userData", JSON.stringify(response.data));

          localStorage.setItem("userToken", response.data.token);
          router.push("/user");
        }
      } catch (error) {
        console.error(error);
        loginError.value = "Tên đăng nhập hoặc mật khẩu không chính xác.";
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      loading,
      loginError,
      login,
    };
  },
});
</script>
