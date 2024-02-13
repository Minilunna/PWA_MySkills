<template>
    <div class="profile-summary">
        <div class="d-flex flex-column align-items-span text-span p-3 py-5">
            <div class="picture-container">
                <!-- Hidden file input for selecting pictures -->
                <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
                <!-- Button to trigger file input and show selected picture status -->
                <a href="#" class="upload btn" @click="triggerFileInput" v-if="showButton" :class="{ 'btn-success': pictureSelected, 'btn-primary': !pictureSelected }">
                    <font-awesome-icon icon="fa-solid fa-camera" />
                </a>
                <!-- Button to reset to the original picture, shown only when a new picture is selected -->
                <a href="#" class="reset btn btn-warning" v-if="pictureSelected" @click="resetPicture">
                    <font-awesome-icon icon="fa-solid fa-undo" />
                </a>
                <img :src="currentPicture" class="rounded-circle mt-5" width="150px">
            </div>

            <h4 class="text-span h6 mt-2">{{ currentUser.name }} {{ currentUser.surname }}</h4>
            <p class="text-span small">{{ currentUser.email }}</p>

            <div class="d-flex">
                <span class="roles" v-for="role in currentUser.roles" :key="role">{{ role.substring(5) }}</span>
            </div>
            <p />
            <div class="profile-details">{{ currentUser.details }}</div>
        </div>
    </div>
</template>

<script>
const defaultPicture = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGNpcmNsZSBzdHlsZT0iZmlsbDojMzI0QTVFOyIgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojMkIzQjRFOyIgZD0iTTUwOS42NCwyOTAuNzY2bC01OS40NDQtNTkuNDQ0bC0xNi42NTMsMTcuMTYxbC02MC4yMzUtNjAuMjM1bC0yOC44MTctNi45NTJsLTMzLjI0NCwyMS4yODINCglsNTAuNzI4LDUwLjcyOGwtMzkuNjcxLDAuMzVMMTkwLjM0LDEyMS42OTFsLTI1LjU2NiwzLjQzNGwtMTQuOTMyLDM2LjQ2Nmw5Mi43Nyw5Mi43N0w1Ni44ODksMjU2bDEyMC4xNzIsMTIwLjE3MmwtMzQuODM4LDIyLjA1DQoJTDI1Niw1MTJsMCwwQzM4NS41OTEsNTEyLDQ5Mi42NzUsNDE1LjcwMyw1MDkuNjQsMjkwLjc2NnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNFQUEyMkY7IiBkPSJNNDQwLjM4NSwyODQuNDQ0SDExMy43Nzh2LTU2Ljg4OWgzMjYuNjA4YzguMTMyLDAsMTQuNzI2LDYuNTkyLDE0LjcyNiwxNC43MjZ2MjcuNDM5DQoJQzQ1NS4xMTEsMjc3Ljg1Miw0NDguNTE3LDI4NC40NDQsNDQwLjM4NSwyODQuNDQ0eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0UwOTExMjsiIGQ9Ik0xMTMuNzc4LDI1NS41Njl2MjguODc1aDMyNi42MDhjOC4xMzIsMCwxNC43MjYtNi41OTIsMTQuNzI2LTE0LjcyNnYtMTQuMTVIMTEzLjc3OHoiLz4NCjxyZWN0IHg9IjExMy43NzgiIHk9IjIyNy41NTYiIHN0eWxlPSJmaWxsOiMzMUJBRkQ7IiB3aWR0aD0iMzAyLjgzOSIgaGVpZ2h0PSI1Ni44ODkiLz4NCjxyZWN0IHg9IjExMy43NzgiIHk9IjI1NiIgc3R5bGU9ImZpbGw6IzJCOUVEODsiIHdpZHRoPSIzMDIuODM5IiBoZWlnaHQ9IjI4LjQ0NCIvPg0KPHBvbHlnb24gc3R5bGU9ImZpbGw6I0ZFRTE4NzsiIHBvaW50cz0iMTEzLjc3OCwyMjcuNTU2IDU2Ljg4OSwyNTYgMTEzLjc3OCwyODQuNDQ0ICIvPg0KPHBvbHlnb24gc3R5bGU9ImZpbGw6I0ZGQzYxQjsiIHBvaW50cz0iNTcuNzUxLDI1NS41NjkgNTYuODg5LDI1NiAxMTMuNzc4LDI4NC40NDQgMTEzLjc3OCwyNTUuNTY5ICIvPg0KPHBvbHlnb24gc3R5bGU9ImZpbGw6IzU5NTk1QjsiIHBvaW50cz0iNTYuODg5LDI1NiA4My40NjYsMjY5LjI4OCA4My40NjYsMjQyLjcxMiAiLz4NCjxwb2x5Z29uIHN0eWxlPSJmaWxsOiMyNzI1MjU7IiBwb2ludHM9IjU3Ljc1MSwyNTUuNTY5IDU2Ljg4OSwyNTYgODMuNDY2LDI2OS4yODggODMuNDY2LDI1NS41NjkgIi8+DQo8Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBjeD0iMTcwLjY2NyIgY3k9IjE0Mi4yMjIiIHI9IjI4LjQ0NCIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0QwRDFEMzsiIGQ9Ik0xNzAuNjY3LDExMy43NzhjLTAuMTkzLDAtMC4zODEsMC4wMjYtMC41NzQsMC4wMjl2NTYuODNjMC4xOTEsMC4wMDMsMC4zNzksMC4wMjksMC41NzQsMC4wMjkNCgljMTUuNzEsMCwyOC40NDQtMTIuNzM0LDI4LjQ0NC0yOC40NDRTMTg2LjM3NSwxMTMuNzc4LDE3MC42NjcsMTEzLjc3OHoiLz4NCjxyZWN0IHg9IjE0Mi4yMjIiIHk9IjMxMi44ODkiIHN0eWxlPSJmaWxsOiNGRkM2MUI7IiB3aWR0aD0iODUuMzMzIiBoZWlnaHQ9Ijg1LjMzMyIvPg0KPHJlY3QgeD0iMTg0LjMyIiB5PSIzMTIuODg5IiBzdHlsZT0iZmlsbDojRUFBMjJGOyIgd2lkdGg9IjQzLjIzNiIgaGVpZ2h0PSI4NS4zMzMiLz4NCjxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBwb2ludHM9IjMxMS4yNDksMjAyLjU3OCAzMjkuODcxLDE0MS42NjcgMzczLjMxLDE4OC4yNDkgIi8+DQo8cG9seWdvbiBzdHlsZT0iZmlsbDojRDBEMUQzOyIgcG9pbnRzPSIzMjkuODcxLDE0MS42NjcgMzI5LjcyMywxNDIuMTUyIDM0My43MjQsMTk1LjA4MSAzNzMuMzEsMTg4LjI0OSAiLz4NCjwvc3ZnPg=='
export default {
    name: 'ProfileSummary',
    props: {
        showButton: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            originalPicture: null, // Affect originalPicture with currentUser.picture
            currentPicture: null,  // Affect currentPicture with currentUser.picture
            pictureSelected: false // Whether a new picture has been selected
        };
    },
    computed: {
        currentUser() {
            return this.$store.state.users.user;
        },
    },
    created() {
        // Set originalPicture with currentUser.picture after the component is created
        this.originalPicture = this.currentUser.picture || defaultPicture;
        this.currentPicture = this.currentUser.picture || defaultPicture;
    },
    methods: {
        triggerFileInput() {
            if (this.pictureSelected) {
                this.$emit('picture-updated', this.currentPicture);
                this.pictureSelected = false; // Reset the selected state
                this.originalPicture = this.currentPicture;
            } else {
                this.$refs.fileInput.click(); // Trigger the file input
            }
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.currentPicture = e.target.result; // Update the image preview
                    this.pictureSelected = true; // Indicate that a picture has been selected
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            }
        },
        resetPicture() {
            this.currentPicture = this.originalPicture; // Reset to the original picture
            this.pictureSelected = false; // Reset the selected state
            this.$refs.fileInput.value = null; // Reset the file input
        }
    }
};
</script>

<style>
.picture-container {
    position: relative;
    display: inline-block;
    width: 150px;
}

.upload {
    position: absolute;
    bottom: 0px;
    right: 0px;
}

.reset {
    position: absolute;
    bottom: 0px;
    left: 0px;
}

.roles {
    display: inline-block;
    font-weight: 400;
    color: #dc3545;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    background-color: transparent;
    border: 1px solid #dc3545;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
    transition: color 0.15s, background-color 0.15s, border-color 0.15s;
}

.editImage {
    position: absolute;
    bottom: -27px;
    right: 20px;
    background: #fe5621;
    color: #fff;
    text-align: center;
    font-size: 18px;
    font-size: 1.8rem;
    width: 54px;
    height: 54px;
    line-height: 54px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    -moz-background-clip: padding;
    -webkit-background-clip: padding-box;
    background-clip: padding-box
}
</style>