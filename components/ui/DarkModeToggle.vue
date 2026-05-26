<template>
  <button
    class="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
    :aria-label="isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'"
    @click="toggleDarkMode"
  >
    <span v-if="isDarkMode">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDarkMode = computed(() => colorMode.value === 'dark')

function toggleDarkMode() {
  colorMode.preference = isDarkMode.value ? 'light' : 'dark'
}
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>
