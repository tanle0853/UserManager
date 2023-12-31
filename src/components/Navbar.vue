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
            <div
              class="nav-link dropdown"
              style="cursor: pointer"
              @click="toggleDropdown"
              v-if="!isLoggedOut"
            >
              <span>{{ username }}</span>
              <ul v-if="isDropdownVisible" class="dropdown-menu" @click="stopPropagation">
                <li>
                  <a class="dropdown-item" href="#" @click="logout">Đăng xuất</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logoutUser } from "@/services/userService";
interface NavbarComponent {
  showListAndAdd: boolean;
  brandLink: string;
  isLoggedIn: boolean;
  isDropdownVisible: boolean;
  username: string | null;
  userLink: string;
  isLoggedOut: boolean;
  logout: () => void;
}
export default defineComponent<NavbarComponent>({
  name: "Navbar",
  data() {
    return {
      isDropdownVisible: false,
      isLoggedOut: false,
    };
  },
  computed: {
    showListAndAdd() {
      if (this.$route.name === "Login") {
        return false;
      } else {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const user = JSON.parse(userData);
          // Kiểm tra vai trò của người dùng, ẩn nút "Thêm mới" nếu là "user"
          return user.user.role !== "user";
        }
        return true;
      }
    },
    brandLink() {
      return this.$route.name === "Login" ? "#" : "/";
    },
    isLoggedIn() {
      return localStorage.getItem("userToken") !== null;
    },
    userLink() {
      return this.isLoggedIn ? "/user" : "#";
    },
    username() {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        return user.user.username;
      }
      return null;
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    logout() {
      logoutUser();
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      (this.isLoggedOut = true), this.$router.push("/login");
    },
    stopPropagation(event: MouseEvent) {
      event.stopPropagation();
    },
  },
});
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  display: none;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
