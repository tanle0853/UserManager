<template>
  <div class="col-md-4 offset-md-4">
    <form @submit.prevent="handleUpdate()" class="card card-body">
      <h1 class="card-title my-3 text-center">Cập nhật</h1>
      <input
        type="text"
        v-model="currentuser.username"
        class="form-control mb-3"
        :disabled="!isAdmin"
      />

      <select v-model="currentuser.role" class="form-control" :disabled="!isAdmin">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button class="btn btn-primary" style="margin-top: 20px" :disabled="!isAdmin">
        Lưu
      </button>
    </form>

    <button @click="handleDelete()" class="btn btn-danger my-4" :disabled="!isAdmin">
      Xóa
    </button>
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
      isAdmin: false, // Điều này dựa trên giá trị từ storage
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
      if (this.isAdmin) {
        try {
          if (typeof this.$route.params.id === "string") {
            await updateuser(this.$route.params.id, this.currentuser);
            this.$router.push("/");
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async handleDelete() {
      if (this.isAdmin) {
        try {
          if (typeof this.$route.params.id === "string") {
            deleteuser(this.$route.params.id);
            this.$router.push("/");
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
  mounted() {
    if (typeof this.$route.params.id === "string") {
      this.loaduser(this.$route.params.id);
    }
    // Kiểm tra và cập nhật giá trị isAdmin từ storage (localStorage)
    const isAdminValue = localStorage.getItem("isAdmin");
    this.isAdmin = isAdminValue === "true";
  },
});
</script>
