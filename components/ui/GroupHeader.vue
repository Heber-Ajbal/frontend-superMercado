<script setup lang="ts">
const props = defineProps({
  group: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
})
</script>
<template>
  <div
    class="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800 md:p-4"
  >
    <h1
      class="mb-2 text-xl font-extrabold text-gray-800 dark:text-white md:text-3xl"
    >
      Welcome to Virtual Care {{ group }}
    </h1>
    <p
      class="text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:px-48 lg:text-xl"
    >
      {{ description ?? '' }}
    </p>
  </div>
</template>
