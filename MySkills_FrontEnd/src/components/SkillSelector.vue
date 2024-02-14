<template>
    <div v-if="skills.length > 0" class="px-3 my-3 d-flex">
        <div class="skill-item-thumb">
            <img id="skill" :src="selectedSkill.icon" class="skill-item-img-card" />
        </div>
        <div class="skill-item-info">
            <h4 class="skill-item-title">
                <select v-model="selectedSkillId" @change="updateSelectedSkill">
                    <option v-for="skill in skills" :key="skill._id" :value="skill._id">{{ skill.name }}</option>
                </select>
            </h4>
            <div v-if="selectedSkill" class="text-lg text-body font-weight-medium pb-1">{{ selectedSkill.description }}
            </div>
            <div v-if="selectedSkill">
                <b>Proficiency:</b>
                <select class="skill-item-proficiency" v-model="localProficiency" @change="updateSelectedSkill">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SkillSelector",
    props: {
        skills: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            selectedSkillId: null,
            selectedSkill: {},
            localProficiency: 'Beginner' // Assuming you want to track this locally
        };
    },
    methods: {
        updateSelectedSkill() {
            if (Array.isArray(this.skills) && this.skills.length > 0) {
                this.selectedSkill = this.skills.find(skill => skill._id === this.selectedSkillId) || {};
                this.$emit("selected-skill", { id: this.selectedSkill._id, proficiency: this.localProficiency });
            }
        }
    },
    watch: {
        selectedSkillId: {
            immediate: true,
            handler() {
                this.updateSelectedSkill();
            }
        },
        skills: {
            immediate: true,
            handler(newSkills) {
                if (newSkills.length > 0 && !this.selectedSkillId) {
                    this.selectedSkillId = newSkills[0]._id;
                    this.updateSelectedSkill();
                }
            }
        }
    }
};
</script>
 
<style scoped>
.skill-item-proficiency {
    border: 0px;
}

.skill-item-thumb {
    width: 110px;
}

.skill-item-info {
    padding-top: 5px;
    padding-left: 15px;
}

.skill-item-title {
    margin-bottom: 8px;
    transition: color 0.3s;
    color: #343b43;
    font-size: 16px;
    font-weight: bold;
}
</style>