<template>
  <Toast ref="toast" />
  <div v-if="currentUser" class="container rounded bg-white mt-5 mb-5">
    <div class="row">
      <div class="col-md-3 border-right">
        <ProfileSummary @picture-updated="pictureUpdated" />
      </div>
      <div class="col-xl-7">
        <ul class="nav nav-tabs" id="profileTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
              type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="true">Profile Settings</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="password-tab" data-bs-toggle="tab" data-bs-target="#password-tab-pane"
              type="button" role="tab" aria-controls="password-tab-pane" aria-selected="false">Change Password</button>
          </li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane fade show active" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab"
            tabindex="0">
            <ProfileEditor @profile-updated="profileUpdated" />
          </div>
          <div class="tab-pane fade" id="password-tab-pane" role="tabpanel" aria-labelledby="password-tab" tabindex="0">
            <PasswordChanger @password-changed="passwordChanged" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileSummary from "@/components/ProfileSummary.vue";
import ProfileEditor from "@/components/ProfileEditor.vue";
import PasswordChanger from "@/components/PasswordChanger.vue";
import Toast from '@/components/Toast.vue';

import AuthService from "@/services/auth.service";


export default {
  name: 'Profile',
  components: {
    ProfileSummary,
    ProfileEditor,
    PasswordChanger,
    Toast
  },
  computed: {
    currentUser() {
      return this.$store.state.users.user;
    },
  },
  methods: {
    async pictureUpdated(picture) {
      try {
        await this.$store.dispatch('users/profileUpdated', { picture });
        this.showToast('Success', 'Profile picture changed successfully!');
      } catch (error) {
        this.showToast('Error', 'Failed to change Profile picture.');
      }
    },
    async passwordChanged(password) {
      try {
        await AuthService.changePassword(password);
        this.showToast('Success', 'Password changed successfully!');
      } catch (error) {
        this.showToast('Error', 'Failed to change password.');
      }
    },
    async profileUpdated(profile) {
      try {
        await this.$store.dispatch('users/profileUpdated', { profile });
        this.showToast('Success', 'Profile changed successfully!');
      } catch (error) {
        this.showToast('Error', 'Failed to change Profile.');
      }
    },
    showToast(title, message) {
      if (this.$refs.toast) {
        this.$refs.toast.showToast(title, message);
      }
    }
  },

};
</script>

<style>
label {
  font-size: 11px
}

.tab-content {
  margin: 10px;
}
</style>