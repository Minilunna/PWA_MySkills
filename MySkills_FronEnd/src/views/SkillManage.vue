<template>
  <Toast ref="toast" />
  <div class="rounded bg-white mt-5 mb-5">
    <div class="row" style="height: 100%;">
      <div class="col">
        <div ref="tblx">
          <table class="table">
            <thead>
              <tr>
                <th>icon</th>
                <th>name</th>
                <th>description</th>
                <th>operation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item._id">
                <td>
                  <img v-if="item.icon" :src="item.icon" class="rounded-circle" width="32px" height="32px">
                  <img v-else src="@/assets/skill.svg" class="rounded-circle" width="32px" height="32px">
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <button class="btn btn-warning" @click="editSkill(item)" title="edit"><font-awesome-icon
                        icon="pencil" /></button>
                    <button class="btn btn-danger" @click="deleteSkill(item)" title="delete"><font-awesome-icon
                        icon="trash" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-between">
            <nav aria-label="Page navigation">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }"><a class="page-link" href="#"
                    @click="prevPage">Previous</a></li>
                <li class="page-item" :class="{ active: page === currentPage }" v-for="page in visiblePages" :key="page">
                  <a class="page-link" href="#" @click="gotoPage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }"><a class="page-link" href="#"
                    @click="nextPage">Next</a></li>
              </ul>
            </nav>
            <button class="btn btn-success" @click="addSkill">Add Skill</button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  <div class="modal" id="editSkillModal" tabindex="-1" aria-labelledby="editSkillModalLabel" aria-hidden="true"
    ref="skillEditModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal header -->
        <div class="modal-header">
          <h5 class="modal-title" id="editSkillModalLabel">{{ editedSkill.title }} Skill</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <!-- Skill edit form -->
          <form @submit.prevent="updateSkill">
            <!-- Form inputs for skill details -->
            <div class="mb-3">
              <label for="editSkillName" class="form-label">Name</label>
              <input type="text" class="form-control" id="editSkillName" v-model="editedSkill.name" required>
            </div>
            <div class="mb-3">
              <label for="editSkillDescription" class="form-label">Description</label>
              <textarea class="form-control" id="editSkillDescription" v-model="editedSkill.description"
                required></textarea>
            </div>
            <!-- Icon preview -->
            <div class="mb-3">
              <label for="editSkillIcon" class="form-label">Icon Preview</label>
              <img v-if="editedSkill.icon" :src="editedSkill.icon" class="img-fluid" alt="Icon Preview" width="150px"
                height="150px">
            </div>
            <!-- File input for selecting a new icon -->
            <div class="mb-3">
              <label for="editSkillNewIcon" class="form-label">Select New Icon</label>
              <input type="file" class="form-control" id="editSkillNewIcon" accept="image/*" @change="handleIconChange">
            </div>
            <!-- Submit button -->
            <button type="submit" class="btn btn-primary">Update</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue';

import { Modal } from 'bootstrap'; // Import the Modal object

export default {
  data() {
    return {
      items: [],
      filter: '',
      currentPage: 1,
      pageSize: 15,
      editedSkill: {},
      modal: null,
      skillToDelete: null
    };
  },
  components: {
    Toast,
  },
  computed: {
    totalPages() {
      return Math.ceil(this.items.length / this.pageSize);
    },
    filteredItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.items.slice(start, end);
    },
    visiblePages() {
      const totalVisiblePages = Math.min(this.totalPages, 10);
      const startPage = Math.max(1, this.currentPage - Math.floor(totalVisiblePages / 2));
      const endPage = Math.min(this.totalPages, startPage + totalVisiblePages - 1);
      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    gotoPage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    showToast(title, message) {
      if (this.$refs.toast) {
        this.$refs.toast.showToast(title, message);
      }
    },
    handleIconChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Read the file and set the preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editedSkill.icon = e.target.result;
          this.editedSkill.iconPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        // If no file selected, clear the icon and preview
        this.editedSkill.icon = '';
        this.editedSkill.iconPreview = '';
      }
    },
    editSkill(skill) {
      this.editedSkill = { title: "Edit", ...skill };
      this.modal = new Modal(this.$refs.skillEditModal);
      this.modal.show();
    },
    addSkill() {
      this.editedSkill = { title: "Add", name: "", description: "", icon: "" };
      this.modal = new Modal(this.$refs.skillEditModal);
      this.modal.show();
    },
    async updateSkill() {
      const { title, iconPreview, ...skill } = this.editedSkill;
      try {
        if (title === "Add") {
          await this.$store.dispatch('skills/addSkill', skill);
          this.showToast('Success', 'Created skill successfully!');
        } else {
          await this.$store.dispatch('skills/modifySkill', skill);
          this.showToast('Success', 'Updated skill successfully!');
        }
        this.editedSkill = {};
        this.modal.hide();
      } catch (error) {
        this.editedSkill = { title, iconPreview, ...skill };
        this.showToast('Error', `Failed to ${title} skill.`);
      }

    },
    deleteSkill(skill) {
      this.skillToDelete = skill._id;
      this.modal = new Modal(this.$refs.skillDeleteModal);
      this.modal.show();
    },
    async deleteConfirmedSkill() {
      try {
        await this.$store.dispatch('skills/deleteSkill', this.skillToDelete);
        this.modal.hide();
      } catch (error) {
        this.showToast('Error', 'Failed to delete skill.');
      }
    },
  },
  created() {
    this.$store.dispatch('skills/fetchSkills').then(() => {
      this.items = this.$store.state.skills.skills;
    });
  },
  watch: {
    '$store.state.skills.skills'(newSkills) {
      this.items = [...newSkills];
    }
  },
};
</script>
<style scoped></style>
