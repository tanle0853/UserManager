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
        <button
          class="btn btn-primary w-100"
          :disabled="!username || !password || loading"
        >
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { loginUser } from "@/services/userService";

export default defineComponent({
  setup() {
    const username = ref("");
    const password = ref("");
    const loading = ref(false); // Thêm biến loading để quản lý trạng thái đăng nhập

    const login = async () => {
      try {
        loading.value = true; // Bắt đầu quá trình đăng nhập

        const loginData = {
          username: username.value,
          password: password.value,
        };

        const response = await loginUser(loginData);

        // Xử lý logic đăng nhập thành công ở đây
        console.log(response);

        // Điều hướng đến trang sau khi đăng nhập thành công
        // this.$router.push({ name: "Home" });
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false; // Kết thúc quá trình đăng nhập
      }
    };

    return {
      username,
      password,
      loading,
      login,
    };
  },
});
</script>
