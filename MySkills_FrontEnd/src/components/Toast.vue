<template>
    <div class="toast-container" style="position: absolute; top: 0; right: 0;">
      <div v-for="(toast, index) in toasts" :key="index" :class="['toast', 'show', toast.type]" role="alert"
        aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">{{ toast.title }}</strong>
          <button type="button" class="btn-close" @click="hideToast(index)" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const toasts = ref([]);

    const showToast = (title, message, type = 'toast-info') => {
      const toast = { title, message, type };
      toasts.value.push(toast);
      setTimeout(() => { hideToast(toasts.value.indexOf(toast));}, 3000); 
    };

    const hideToast = (index) => {
      toasts.value.splice(index, 1);
    };

    return { toasts, showToast, hideToast };
  }
};
</script>
