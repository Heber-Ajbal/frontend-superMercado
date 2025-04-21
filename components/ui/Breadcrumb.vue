<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  paths: {
    type: Array<{
      route: string
      text: string
    }>,
    default: () => [],
  },
})
</script>

<template>
  <div class="flex flex-wrap items-center text-xs">
    <ul class="flex items-center">
      <li class="inline-flex items-center">
        <NuxtLink
          href="/"
          class="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-white"
        >
          <font-awesome-icon icon="fa-solid fa-home" />
        </NuxtLink>

        <span class="mx-4 h-auto font-medium text-gray-400">/</span>
      </li>

      <li v-for="path in paths" class="inline-flex items-center">
        <NuxtLink
          :to="path.route"
          class="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-white"
        >
          {{ path.text }}
        </NuxtLink>
        <span class="mx-4 h-auto font-medium text-gray-400">/</span>
      </li>
    </ul>
  </div>
</template>
