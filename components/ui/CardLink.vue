<script setup lang="ts">

defineProps({
    title: String,
    path: String,
    cta:{
        type: String,
        default:''
    },
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl border-2">
    <div class="flex justify-between items-start">
      <div class="flex flex-col">
        <h2 class="text-gray-600 tracking-wide">
          {{ title }}
        </h2>
        <NuxtLink
          :to="path"
          class="text-xs text-gray-800"
        >
          {{ cta }}
        </NuxtLink>
      </div>
      <div class="p-2 md:p-1 xl:p-2 rounded-md">
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>