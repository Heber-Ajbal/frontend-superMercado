<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Table from '~/components/ui/Table.vue'
import ProductoForm from '~/components/productos/ProductoForm.vue'
import { ref } from 'vue'

const productos = ref([
    {
        codProducto: 1,
        Nombre: 'Leche',
        Precio_compra: 5.00,
        Precio_venta: 6.50,
        Categoria: 'Lácteos',
        Imagen: null,
    },
    {
        codProducto: 2,
        Nombre: 'Arroz',
        Precio_compra: 3.50,
        Precio_venta: 4.25,
        Categoria: 'Granos',
        Imagen: null,
    }
])

const showModal = ref(false)
const productoSeleccionado = ref(null)

function agregarProducto() {
    productoSeleccionado.value = null
    showModal.value = true
}

function editarProducto(producto: any) {
    productoSeleccionado.value = { ...producto }
    showModal.value = true
}
</script>

<template>
    <Page>
        <template #header>
            <Breadcrumb :items="['Productos']" />
        </template>

        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Productos</h2>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="agregarProducto">
                Agregar Producto
            </button>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <div v-for="p in productos" :key="p.codProducto"
                class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-md transition p-4 flex flex-col justify-between">
                <img :src="p.Imagen || 'https://via.placeholder.com/150'" alt="producto"
                    class="h-40 object-cover rounded mb-4" />
                <div class="mb-2">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ p.Nombre }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-300">{{ p.Categoria }}</p>
                </div>
                <div class="flex justify-between items-center mt-auto">
                    <span class="text-green-600 font-semibold text-md">${{ p.Precio_venta.toFixed(2) }}</span>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        @click="editarProducto(p)">
                        Editar
                    </button>
                </div>
            </div>
        </div>


        <ProductoForm v-if="showModal" :producto="productoSeleccionado" @close="showModal = false" />
    </Page>
</template>
