<template>
  <!-- Page Heading -->
  <header
    v-if="$slots.header"
    class="border-b border-gray-200 bg-white/60 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
  >
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <slot name="header" />
    </div>
  </header>

  <!-- Page Content -->
  <main>
    <div class="py-4 text-gray-900 dark:text-gray-100">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </div>
  </main>
</template>
