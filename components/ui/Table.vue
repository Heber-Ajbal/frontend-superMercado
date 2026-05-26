<script setup lang="ts">
const props = defineProps<{
  columns: string[],
  rows: (string | { type: 'button', label: string, action: () => void })[][]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-gray-900 dark:text-gray-100">
      <thead class="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white">
        <tr>
          <th v-for="col in props.columns" :key="col" class="px-4 py-3 font-semibold">{{ col }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="(row, rowIndex) in props.rows" :key="rowIndex" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-4 py-3 text-gray-900 dark:text-gray-100">
            <template v-if="typeof cell === 'string'">
              {{ cell }}
            </template>
            <template v-else-if="cell.type === 'button'">
              <button class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600" @click="cell.action">
                {{ cell.label }}
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
