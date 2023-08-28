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
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link" :to="userLink">{{ username }}</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <a class="nav-link" href="#" @click="logout">Đăng xuất</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface NavbarComponent {
  showListAndAdd: boolean;
  brandLink: string;
  isLoggedIn: boolean;
  username: string | null;
  userLink: string;
  logout: () => void;
}

export default defineComponent<NavbarComponent>({
  name: "Navbar",
  computed: {
    showListAndAdd() {
      return this.$route.name !== "Login";
    },
    brandLink() {
      return this.$route.name === "Login" ? "#" : "/";
    },
    isLoggedIn() {
      return localStorage.getItem("userToken") !== null;
    },
    username() {
      return localStorage.getItem("username");
    },
    userLink() {
      return this.isLoggedIn ? "/user" : "#";
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("userToken");
      this.$router.push("/login");
    },
  },
});
</script>
