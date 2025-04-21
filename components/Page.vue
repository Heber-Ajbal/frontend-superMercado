<template>
  <!-- Page Heading -->
  <header v-if="$slots.header" class="shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <slot name="header" />
    </div>
  </header>

  <!-- Page Content -->
  <main>
    <div class="py-4">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </div>
  </main>
</template>
