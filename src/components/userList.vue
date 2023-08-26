<template>
<div>
  <h1>Danh sach User</h1>
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

export default defineComponent({
  name: "users-list",
  data() {
    return {
      users: [] as user[],
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
  },
  mounted() {
    this.loadUsers();
  },
});
</script>