<template>
  <Toast ref="toast" />
  <div class="rounded bg-white mt-5 mb-5">
    <div class="row" style="height: 100%;">
      <div class="col-md-4">
        <SkillSearchInput :skills="allSkills" @skills-selected="handleSelectedSkill" />
      </div>
      <div class="col-xl-7">
        <div v-if="filteredUsers.length == 0"><h2>No matches</h2></div>
        <div ref="tblx" v-else>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Skills</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="text-center">
                  <div class="d-flex flex-column align-items-center">
                    <div class="d-inline">
                      <img v-if="user.picture" :src="user.picture" class="rounded-circle" width="32px" height="32px">
                      <img v-else src="@/assets/skill.svg" class="rounded-circle" width="32px" height="32px">
                    </div>
                    <div>{{ user.name }} {{ user.surname }}</div>
                    <div><b>{{ user.email }}</b></div>
                  </div>
                </td>
                <td>
                  <div class="pill-container">
                    <div class="pill text-sm" v-for="skill in user.skills" :key="skill.skill._id"
                      :class="skill.proficiency.toLowerCase()" :title="skill.proficiency">{{ skill.skill.name }}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }"><a class="page-link" href="#" @click="prevPage">Previous</a></li>
              <li class="page-item" :class="{ active: page === currentPage }" v-for="page in visiblePages" :key="page"><a class="page-link" href="#" @click="gotoPage(page)">{{ page }}</a></li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }"><a class="page-link" href="#" @click="nextPage">Next</a></li>
            </ul>
          </nav>          
        </div>
        <div class="row">
          <div class="col-md-3">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="color-square beginner"></div>
              </div>
              <div class="col">
                <div class="color-description">Beginner</div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="color-square intermediate"></div>
              </div>
              <div class="col">
                <div class="color-description">Intermediate</div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="color-square advanced"></div>
              </div>
              <div class="col">
                <div class="color-description">Advanced</div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="color-square expert"></div>
              </div>
              <div class="col">
                <div class="color-description">Expert</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkillSearchInput from "@/components/SkillSearchInput.vue";
import Toast from '@/components/Toast.vue';

export default {
  data() {
    return {
      allSkills: [],
      searchResult: [],
      filter: '',
      currentPage: 1,
      pageSize: 10
    };
  },
  components: {
    SkillSearchInput,
    Toast,
  },
  computed: {
    totalPages() {
      return Math.ceil(this.searchResult.length / this.pageSize);
    },
    filteredUsers() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.searchResult.slice(start, end);
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
    searchUsers() {
      this.currentPage = 1; // Reset current page when searching
      this.$refs.toast.hideToast(0);
    },
    showToast(title, message) {
      if (this.$refs.toast) {
        this.$refs.toast.showToast(title, message);
      }
    },
    handleSelectedSkill(skills) {
      this.showToast("search", "Searching...");
      // Dispatch an action to fetch users by skill
      this.$store.dispatch('users/fetchUsersBySkills', skills)
        .then((users) => { this.searchResult = users; this.searchUsers() })
        .catch(() => { this.showToast('Error', 'Failed to search for user skill.'); });
    }

  },
  created() {
    this.$store.dispatch('skills/fetchSkills').then(() => {
      this.allSkills = this.$store.state.skills.skills;
    });
  }
};
</script>
<style scoped>
.beginner {
  background-color: #3498db;
  /* Light Blue */
}

.intermediate {
  background-color: #f1c40f;
  /* Yellow */
}

.advanced {
  background-color: #e67e22;
  /* Orange */
}

.expert {
  background-color: #27ae60;
  /* Green */
}

.pill {
  border-radius: 20px;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.pill-container {
  display: flex;
  flex-wrap: wrap;
}

.color-square {
  width: 16px;
  height: 16px;
  margin-bottom: 6px;
  border-radius: 5px;
}</style>
