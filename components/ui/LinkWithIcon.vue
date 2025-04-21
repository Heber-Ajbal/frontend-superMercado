<script setup lang="ts">
defineProps({
  title: String,
  href: String,
  target: String,
})
</script>
<template>
  <NuxtLink
    :to="href"
    :target="target"
    class="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
  >
    {{ title }}
    <div class="pr-2">
      <slot name="icon" />
    </div>
  </NuxtLink>
</template>
