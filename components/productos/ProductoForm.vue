<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{ producto: any | null }>()
const emit = defineEmits(['close'])

const categorias = ['Lácteos', 'Granos', 'Bebidas', 'Snacks']

const form = ref({
  Nombre: '',
  Precio_compra: 0,
  Precio_venta: 0,
  Categoria: 'Lácteos',
  Imagen: null as string | null,
})

watch(() => props.producto, (nuevo) => {
  if (nuevo) {
    form.value = { ...nuevo }
  } else {
    form.value = {
      Nombre: '',
      Precio_compra: 0,
      Precio_venta: 0,
      Categoria: 'Lácteos',
      Imagen: null,
    }
  }
}, { immediate: true })

function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    form.value.Imagen = reader.result as string
  }
  reader.readAsDataURL(file)
}

function guardar() {
  // Aquí luego enviarás a backend
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl dark:bg-gray-800">
      <h3 class="text-xl font-bold mb-4">{{ props.producto ? 'Editar Producto' : 'Agregar Producto' }}</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <input v-model="form.Nombre" placeholder="Nombre" class="input" />
        <input v-model.number="form.Precio_compra" type="number" placeholder="Precio Compra" class="input" />
        <input v-model.number="form.Precio_venta" type="number" placeholder="Precio Venta" class="input" />

        <select v-model="form.Categoria" class="input">
          <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
        </select>

        <div class="flex flex-col gap-2">
          <input type="file" @change="handleImageChange" accept="image/*" class="input" />
          <img v-if="form.Imagen" :src="form.Imagen" class="h-32 object-cover rounded" />
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded;
}
</style>
