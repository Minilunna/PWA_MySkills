<template>
    <Toast ref="toast" />
    <!-- Bootstrap Modal for Confirmation -->
    <div class="modal" id="skillDeleteModal" ref="skillDeleteModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm skill removal</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to remove this skill?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger" @click="deleteConfirmedSkill">Yes</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Bootstrap Modal for Confirmation -->
    <div class="modal" id="skillAddModal" ref="skillAddModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add a new Skill</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <SkillSelector ref="skillSelector" :skills="currentSkills" @selected-skill="handleSelectedSkill" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="addSkill">Yes</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="currentUser" class="container rounded bg-white mt-5 mb-5">
        <div class="row">
            <div class="col-md-3 border-right">
                <ProfileSummary :showButton="false" />
            </div>
            <!-- Skilllist-->
            <div class="col-lg-8 pb-5">
                <SkillComponent v-for="(skill, index) in currentUser.skills" :key="index" :skill="skill"
                    @update="updateSkill" @delete="confirmDeleteSkill" />
                <div class="d-flex justify-content-end">
                    <button class="btn btn-success" @click="addSkillModal">Add new Skill</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import SkillComponent from "@/components/SkillComponent.vue";
import SkillSelector from "@/components/SkillSelector.vue";
import ProfileSummary from "@/components/ProfileSummary.vue";
import Toast from '@/components/Toast.vue';

import { Modal } from 'bootstrap'; // Import the Modal object

export default {
    name: "SkillsBoard",
    components: {
        SkillComponent,
        SkillSelector,
        ProfileSummary,
        Toast
    },
    data() {
        return {
            skillToDelete: null, // Add this to store the skill to delete
            skillDeleteModal: null, // This will hold the Modal instance
            skillAddModal: null, // This will hold the Modal instance         
            newSkill: null, // This will hold the new skill   
        };
    },
    methods: {
        confirmDeleteSkill(skill) {
            this.skillToDelete = skill;
            this.skillDeleteModal.show(); // Use the Modal instance to show the modal
        },
        async deleteConfirmedSkill() {
            try {
                await this.$store.dispatch('users/removeSkillFromUser', this.skillToDelete);
                this.skillDeleteModal.hide(); // Use the Modal instance to hide the modal
            } catch (error) {
                this.showToast('Error', 'Failed to delete user skill.');
            }
        },
        async updateSkill(skill) {
            try {
                await this.$store.dispatch('users/modifySkillForUser', skill);
                this.showToast('Success', 'Updated user skill successfully!');
            } catch (error) {
                this.skillDeleteModal.hide(); // Use the Modal instance to hide the modal
                this.showToast('Error', 'Failed to update user skill.');
            }

        },
        addSkillModal() {
            this.skillAddModal.show(); // Use the Modal instance to show the modal
        },
        handleSelectedSkill(selectedSkill) { // Update the selected skill 
            this.newSkill = selectedSkill;
        },
        async addSkill() {
            try {
                await this.$store.dispatch('users/addSkillToUser', this.newSkill);
                this.skillAddModal.hide(); // Use the Modal instance to hide the modal
            } catch (error) {
                this.skillAddModal.hide(); // Use the Modal instance to hide the modal
                this.showToast('Error', 'Failed to add the user skill.');
            }
        },
        showToast(title, message) {
            if (this.$refs.toast) {
                this.$refs.toast.showToast(title, message);
            }
        }
    },
    mounted() {
        this.skillDeleteModal = new Modal(this.$refs.skillDeleteModal); // Initialize the Modal instance
        this.skillAddModal = new Modal(this.$refs.skillAddModal); // Initialize the Modal instance
    },
    computed: {
        currentUser() {
            return this.$store.state.users.user;
        },
        currentSkills() {
            if (this.$store.state.users.user && this.$store.state.skills.skills){
                const userSkills = this.$store.state.users.user.skills.map(skill => skill.skill._id);
                return this.$store.state.skills.skills.filter(skill => !userSkills.includes(skill._id));
            }
            return [];
        },
    } ,
  created() {
    this.$store.dispatch('skills/fetchSkills'); 
  }
};
</script>