<template>
  <div class="col-md-4 offset-4">
    <div class="card card-body">
      <h1 class="card-title my-3 text-center">Them User</h1>
      <form @submit.prevent="saveuser()">
        <input
          class="form-control mb-3"
          placeholder="User name"
          type="title"
          v-model="user.username"
          autofocus
        />
        <input
          type="password"
          class="form-control mb-3"
          placeholder="password"
          rows="3"
          v-model="user.password"
        />
        <button
          class="btn btn-primary w-100"
          :disabled="!user.username || !user.password"
        >
          Luu
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { user } from "@/interfaces/user";
import { createuser } from "@/services/userService";

export default defineComponent({
  data() {
    return {
      user: {} as user,
    };
  },
  methods: {
    async saveuser() {
      try {
        const res = await createuser(this.user);
        console.log(res);
        this.$router.push({ name: "user" });
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>
