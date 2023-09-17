<template>
  <div>
    <h1>Danh sach User</h1>
    <!-- Thêm hộp tìm kiếm và nút tìm kiếm -->
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Tìm kiếm theo tên người dùng"
        v-model="searchQuery"
      />
     <button class="btn btn-outline-secondary text-white" style="background-color: var(--bs-heading-color)" type="button" @click="searchUsers">
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
        // Gửi yêu cầu tìm kiếm với giá trị `searchQuery`
        const res = await searchUsers(this.searchQuery);
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
