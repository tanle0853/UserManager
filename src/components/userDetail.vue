<template>
  <div class="col-md-4 offset-md-4">
    <form @submit.prevent="handleUpdate()" class="card card-body">
      <h1 class="card-title my-3 text-center">Cap nhat</h1>

      <input
        type="text"
        v-model="currentuser.username"
        class="form-control mb-3"
      />

      <!-- <textarea
        v-model="currentuser.password"
        class="form-control mb-3"
      ></textarea> -->

      <button class="btn btn-primary">Luu</button>
    </form>

    <button @click="handleDelete()" class="btn btn-danger my-4">Xoa</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { user } from "@/interfaces/user";
import { deleteuser, getuser, updateuser } from "@/services/userService";

export default defineComponent({
  name: "user",
  data() {
    return {
      currentuser: {} as user,
    };
  },
  methods: {
    async loaduser(id: string) {
      try {
        const { data } = await getuser(id);
        this.currentuser = data;
      } catch (error) {
        console.error(error);
      }
    },
    async handleUpdate() {
      try {
        if (typeof this.$route.params.id === "string") {
          await updateuser(this.$route.params.id, this.currentuser);
          this.$router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async handleDelete() {
      try {
        if (typeof this.$route.params.id === "string") {
          deleteuser(this.$route.params.id);
          this.$router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    if (typeof this.$route.params.id === "string") {
      this.loaduser(this.$route.params.id);
    }
  },
});
</script>