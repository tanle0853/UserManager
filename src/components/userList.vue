<template>
  <div>
    <h1>Danh sach User</h1>
    <!-- Thêm hộp tìm kiếm và nút tìm kiếm -->
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Tìm kiếm theo tên người dùng"
        @keydown.enter="searchUsers"
        v-model="searchQuery"
      />
      <button
        class="btn btn-outline-secondary text-white btn-search"
        type="button"
        @click="searchUsers"
        @mousedown="isSearchActive = true"
        @mouseup="isSearchActive = false"
        :class="{ active: isSearchActive }"
      >
        Tìm kiếm
      </button>
    </div>
    <ul class="list-group">
      <li
        class="list-group-item list-group-item-action p-4"
        style="cursor: pointer"
        v-for="(user, index) in users"
        :key="index"
        @click="this.$router.push(`/user/${user._id}`)"
      >
        {{ index + 1 }}.
        {{ user.username }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { user } from "@/interfaces/user";
import { getusers } from "@/services/userService";
import { defineComponent } from "vue";
import { searchUsers } from "@/services/userService";

export default defineComponent({
  name: "users-list",
  data() {
    return {
      users: [] as user[],
      searchQuery: "",
      isSearchActive: false, // Thêm biến isSearchActive
    };
  },
  methods: {
    async loadUsers() {
      try {
        const res = await getusers();
        this.users = res.data;
      } catch (error) {
        console.error(error);
      }
    },

    async searchUsers() {
      try {
        let res;
        if (this.searchQuery.trim() === "") {
          // Nếu `searchQuery` là chuỗi rỗng, gửi yêu cầu để lấy tất cả người dùng
          res = await getusers();
        } else {
          // Nếu có `searchQuery`, gửi yêu cầu tìm kiếm với giá trị `searchQuery`
          res = await searchUsers(this.searchQuery);
        }
        this.users = res.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.loadUsers();
  },
});
</script>
<style scoped>
/* CSS cho nút tìm kiếm */
.btn-search {
  background-color: var(--bs-heading-color);
  color: white;
  transition: background-color 0.3s; /* Thêm transition cho background-color */
}

/* CSS cho nút tìm kiếm khi di chuột vào */
.btn-search:hover {
  background-color: lightblue; /* Đổi màu nền khi hover */
}

/* CSS cho nút tìm kiếm khi được nhấn - màu bạc */
.btn-search.active-silver {
  background-color: silver; /* Đổi màu nền thành bạc khi nhấn */
  color: var(--bs-heading-color); /* Đổi màu chữ khi nhấn */
}

/* CSS cho nút tìm kiếm khi được nhấn - màu xanh nhạt */
.btn-search.active-light-blue {
  background-color: silver; /* Đổi màu nền thành xanh nhạt khi nhấn */
  color: var(--bs-heading-color); /* Đổi màu chữ khi nhấn */
}
</style>
