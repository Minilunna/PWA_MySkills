<template>
  <Toast ref="toast" />
  <div id="app">
    <nav v-if="$route.path !== '/'" class="navbar navbar-expand navbar-bg d-flex justify-content-between">
      <!-- navbar-dark bg-dark-->
      <a href="/home" class="navbar-brand"><img src="@/assets/skill.svg" width="32" height="32"
          class="d-inline-block align-center" alt="My Skills"> My Skills</a>

      <div class="navbar-nav mr-auto">
        <li v-if="showManagerBoard" class="nav-item"><router-link to="/skills-manage" class="nav-link"><font-awesome-icon icon="gears" />Manage Skills</router-link></li>
        <li v-if="showManagerBoard" class="nav-item"><router-link to="/skills-search" class="nav-link"><font-awesome-icon icon="magnifying-glass" />Search for Skills</router-link></li>
        <li v-if="currentUser" class="nav-item"><router-link to="/skills" class="nav-link"><font-awesome-icon icon="book" />Own Skills</router-link></li>
      </div>

      <div v-if="currentUser" class="navbar-nav">
        <li class="nav-item"><router-link to="/profile" class="nav-link"><font-awesome-icon icon="user" />{{ currentUser.username }}</router-link></li>
        <li class="nav-item"><a class="nav-link" @click.prevent="logOut"><font-awesome-icon icon="sign-out-alt" />LogOut</a></li> 
      </div>
      <div v-else class="navbar-nav">
        <li class="nav-item"><router-link to="/register" class="nav-link"><font-awesome-icon icon="user-plus" /> Sign Up</router-link></li>
        <li class="nav-item"><router-link to="/login" class="nav-link"><font-awesome-icon icon="sign-in-alt" />Login</router-link></li>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue';

export default {
  components: {
    Toast
  },
  computed: {
    currentUser() {
      return this.$store.state.users.user;
    },    
    showManagerBoard() {
      return this.currentUser && this.currentUser['roles'] ? this.currentUser['roles'].includes('ROLE_MANAGER') : false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout').then(() => { this.$router.push("/login"); });
    },
  }

};
</script>
<style>
.modal-header,
.navbar-bg {
  background-color: #e3f2fd;
}
</style>
