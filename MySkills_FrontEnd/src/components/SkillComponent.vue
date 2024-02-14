<template>
    <div class="skill-item d-md-flex justify-content-between">
        <span class="remove-item" @click="onSkillDelete" v-if="showDeleteButton"><font-awesome-icon icon="fa-solid fa-times" /></span>
        <div class="px-3 my-3 d-flex">
            <div class="skill-item-thumb">
                <img id="skill" :src="skill.skill.icon" class="skill-item-img-card" />
            </div>
            <div class="skill-item-info">
                <h4 class="skill-item-title">{{ skill.skill.name }}</h4>
                <div class="text-lg text-body font-weight-medium pb-1">{{ skill.skill.description }}</div>
                <div>
                    <b>Proficiency:</b>
                    <select class="skill-item-proficiency" v-model="localProficiency" @change="updateProficiency">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>
 
<script>
export default {
    name: "SkillComponent",
    props: {
        skill: {
            type: Object,
            required: true
        },
        showDeleteButton: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            localProficiency: this.skill.proficiency
        };
    },
    watch: {
        skill: {
            handler(newValue) {
                this.localProficiency = newValue.proficiency;
            },
            deep: true
        }
    },
    methods: {
        onSkillDelete() {
            this.$emit('delete', this.skill.skill._id);
        },
        updateProficiency() {
            this.$emit('update', { id: this.skill.skill._id, proficiency: this.localProficiency });
        }
    }
};
</script>
 
<style scoped>
.skill-item {
    position: relative;
    margin-bottom: 30px;
    padding: 0 50px 0 10px;
    background-color: #fff;
    box-shadow: 0 12px 20px 1px rgba(64, 64, 64, .09);
}

.remove-item {
    display: block;
    position: absolute;
    top: -5px;
    right: -5px;
    width: 22px;
    height: 22px;
    padding-left: 1px;
    border-radius: 50%;
    background-color: #ff5252;
    color: #fff;
    line-height: 23px;
    text-align: center;
    box-shadow: 0 3px 12px 0 rgba(255, 82, 82, .5);
    cursor: pointer;
}

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

.remove-item {
    right: -10px !important;
}

@media (max-width: 991px) {
    .skill-item {
        padding-right: 30px;
    }
}

@media (max-width: 400px) {
    .skill-item {
        padding-right: 10px;
        padding-bottom: 15px;
    }

    .skill-item-thumb {
        display: block;
        margin: 0 auto 10px;
    }

    .skill-item-info {
        display: block;
        padding-left: 0;
    }
}
</style>