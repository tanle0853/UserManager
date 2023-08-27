<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link :to="brandLink" class="navbar-brand">Quản lý user</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-if="showListAndAdd">
            <router-link class="nav-link" to="/">Danh sách</router-link>
          </li>
          <li class="nav-item" v-if="showListAndAdd">
            <router-link class="nav-link" to="/user/new">Thêm mới</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navbar",
  computed: {
    showListAndAdd() {
      // Điều chỉnh logic dựa vào trạng thái đăng nhập
      return !this.$route.name || this.$route.name !== "login";
    },
    brandLink() {
      // Điều chỉnh liên kết dựa vào trang đăng nhập
      return this.$route.name === "login" ? "#" : "/";
    },
  },
});
</script>
