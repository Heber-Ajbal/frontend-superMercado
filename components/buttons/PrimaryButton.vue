<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'submit',
  },
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :class="{
      'mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4': true,
      'bg-blue-900 text-white ring-blue-500 hover:bg-blue-900 dark:bg-blue-900 dark:ring-blue-900 dark:hover:bg-blue-800':
        active,
      'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800':
        !active,
    }"
    :type="type"
    class="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    <slot />
  </button>
</template>
