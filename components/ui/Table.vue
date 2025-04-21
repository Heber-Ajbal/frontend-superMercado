<script setup lang="ts">
const props = defineProps<{
  columns: string[],
  rows: (string | { type: 'button', label: string, action: () => void })[][]
}>()
</script>

<template>
  <table class="w-full text-left border border-gray-300 dark:border-gray-600">
    <thead class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
      <tr>
        <th v-for="col in props.columns" :key="col" class="px-4 py-2">{{ col }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in props.rows" :key="rowIndex" class="hover:bg-gray-50 dark:hover:bg-gray-800">
        <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-4 py-2">
          <template v-if="typeof cell === 'string'">
            {{ cell }}
          </template>
          <template v-else-if="cell.type === 'button'">
            <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" @click="cell.action">
              {{ cell.label }}
            </button>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
