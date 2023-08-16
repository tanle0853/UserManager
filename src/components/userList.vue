<template>
  <h1>Danh sach sinh vien</h1>
  <ul class="list-group">
    <li
      class="list-group-item list-group-item-action p-4"
      style="cursor: pointer"
      v-for="(user, index) in user"
      :key="index"
      @click="this.$router.push(`/user/${user._id}`)"
    >
      {{ index + 1 }}.
      {{ user.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { user } from "@/interfaces/user";
import { getuser } from "@/services/userervice";
import { defineComponent } from "vue";

export default defineComponent({
  name: "user-list",
  data() {
    return {
      user: [] as user[],
    };
  },
  methods: {
    async loaduser() {
      try {
        const res = await getusers();
        this.user = res.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.loaduser();
  },
});
</script>