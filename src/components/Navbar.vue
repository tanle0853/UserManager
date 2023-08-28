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
            <router-link class="nav-link" :to="userLink">
              <span @click="toggleLogout">{{ username }}</span>
              <ul v-if="isLogoutVisible" class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click="logout">Đăng xuất</a>
                </li>
              </ul>
            </router-link>
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
  isLogoutVisible: boolean;
  username: string | null;
  userLink: string;
  logout: () => void;
}
export default defineComponent<NavbarComponent>({
  name: "Navbar",
  data() {
    return {
      isLogoutVisible: false,
    };
  },
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
    userLink() {
      return this.isLoggedIn ? "/user" : "#";
    },
    username() {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        return user.username;
      }
      return null;
    },
  },
  methods: {
    toggleLogout() {
      this.isLogoutVisible = !this.isLogoutVisible;
    },
    logout() {
      localStorage.removeItem("userToken");
      localStorage.removeItem("username");
      this.$router.push("/login");
    },
  },
});
</script>
<style>
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px;
  display: none;
}

.nav-item:hover .user-dropdown {
  display: block;
}

.user-link {
  display: block;
  padding: 5px 10px;
  text-decoration: none;
  color: black;
}

.logout-link {
  display: block;
  padding: 5px 10px;
  text-decoration: none;
  color: black;
}
</style>