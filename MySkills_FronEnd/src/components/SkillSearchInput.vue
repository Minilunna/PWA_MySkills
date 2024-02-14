<template>
    <div class="pill-container">
        <div class="pill text-sm" v-for="selectedSkill in selectedSkills" :key="selectedSkill._id">
            {{ selectedSkill.name }}
            <span class="remove-pill" @click="removeSkill(selectedSkill)">
                <font-awesome-icon icon="fa-solid fa-times" />
            </span>
        </div>
    </div>
    <input ref="searchInput" type="text" placeholder="Search skills..." v-model="searchText" @focus="isInputFocused = true"
        @blur="isInputFocused = false" />
    <div v-if="isInputFocused || isMouseOver || searchText != ''" class="skill-list">
        <div class="item skill d-flex flex-row justify-content-between" v-for="skill in filteredList" :key="skill._id"
            @click="handleItemClick(skill)" @mousedown="mouseDownHandler">
            <div class="d-flex align-items-center">
                <img class="icon" :src="skill.icon" /> {{ skill.name }}
            </div>
        </div>
    </div>
    <div class="item error" v-if="searchText && !filteredList.length">
        <p>No results found!</p>
    </div>
</template>

<script>
export default {
    name: "SkillSearchInput",
    emits: ['skills-selected'], // Declare the skills-selected event
        props: {
        skills: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            localSkills: this.skills,
            searchText: '',
            selectedSkills: [], // Array to store selected skills
            isInputFocused: false,
            isMouseOver: false,
        };
    },
    computed: {
        filteredList() {
            if (Array.isArray(this.localSkills) && this.localSkills.length > 0) {
                const searchTextLower = this.searchText.toLowerCase();
                return this.localSkills.filter(skill =>
                    skill.name.toLowerCase().includes(searchTextLower) && !this.selectedSkills.some(selectedSkill => selectedSkill._id === skill._id)
                );
            }
            return [];
        }
    },
    watch: {
        skills: {
            immediate: true,
            handler(newSkills) {
                this.localSkills = newSkills;
            }
        }
    },
    methods: {
        handleItemClick(skill) {
            const index = this.selectedSkills.findIndex(selectedSkill => selectedSkill._id === skill._id);
            if (index === -1) {
                this.selectedSkills.push(skill);
            } else {
                this.selectedSkills.splice(index, 1);
            }
            this.$emit('skills-selected', this.selectedSkills);
            setTimeout(() => { this.isInputFocused = false; }, 100);
        },
        removeSkill(skillToRemove) {
            const index = this.selectedSkills.findIndex(selectedSkill => selectedSkill._id === skillToRemove._id);
            if (index !== -1) {
                this.selectedSkills.splice(index, 1);
            }
            this.$emit('skills-selected', this.selectedSkills);
        },
        blurHandler() {
            // Blur the input immediately if not mouse over the skill list
            if (!this.isMouseOver) {
                this.isInputFocused = false;
            }
        },
        mouseDownHandler() {
            // Prevent the default behavior of the input blur event to keep the skill list visible
            event.preventDefault();
        }
    }
};
</script>


<style scoped>
input {
    display: block;
    width: 350px;
    margin: 20px auto;
    padding: 10px 45px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.item,
.error {
    margin: 0 auto 10px auto;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    vertical-align: middle;
}

.icon {
    width: 32px;
    height: 32px;
    margin-right: 16px;
}

.skill {
    cursor: pointer;
    background-color: rgb(97, 62, 252);
}

.error {
    background-color: red;
    width: 350px;
}

.skill-list {
    max-height: 350px;
    width: 350px;
    overflow-y: auto;
    margin: 20px auto;
}

.pill-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}

.pill {
    background-color: #007bff;
    color: white;
    border-radius: 20px;
    padding: 5px 10px;
    margin-right: 5px;
    margin-bottom: 5px;
}

.remove-pill {
    cursor: pointer;
    margin-left: 5px;
}
</style>
