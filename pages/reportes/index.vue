<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBoxArchive,
  faCashRegister,
  faFileArrowDown,
  faPrint,
  faReceipt,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Page from '~/components/Page.vue'
import GetVentas from '~/api/ventas/getVentas.gql'
import GetCompras from '~/api/compras/getCompras.gql'
import GetInventario from '~/api/inventario/getInventario.gql'
import { exportarReportePDF } from '~/utils/reportes'

const today = new Date().toISOString().slice(0, 10)
const thirtyDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

const filtros = ref({
  fechaInicio: thirtyDaysAgo,
  fechaFin: today
})

const { result: ventasResult, loading: loadingVentas, refetch: refetchVentas } = useQuery(GetVentas, null, {
  fetchPolicy: 'network-only'
})
const { result: comprasResult, loading: loadingCompras, refetch: refetchCompras } = useQuery(GetCompras, null, {
  fetchPolicy: 'network-only'
})
const { result: inventarioResult, loading: loadingInventario, refetch: refetchInventario } = useQuery(GetInventario, null, {
  fetchPolicy: 'network-only'
})

const loading = computed(() => loadingVentas.value || loadingCompras.value || loadingInventario.value)

const ventas = computed(() =>
  (ventasResult.value?.ventas ?? []).map((venta: any) => ({
    idVenta: venta.idVenta,
    fecha: venta.fecha,
    hora: venta.hora?.slice(0, 5) ?? '',
    cliente: `${venta.idClienteNavigation?.nombre ?? 'Desconocido'} ${venta.idClienteNavigation?.apellidoPaterno ?? ''}`.trim(),
    empleado: `${venta.idEmpleadoNavigation?.nombre ?? 'Desconocido'} ${venta.idEmpleadoNavigation?.apellidoPaterno ?? ''}`.trim(),
    monto: Number(venta.monto ?? 0),
    cantidadProductos: (venta.detalleVenta ?? []).reduce((acc: number, item: any) => acc + Number(item.cantidad ?? 0), 0)
  }))
)

const compras = computed(() =>
  (comprasResult.value?.compras ?? []).map((compra: any) => ({
    idCompra: compra.idCompra,
    fecha: compra.fecha,
    proveedor: compra.codProveedorNavigation?.nombre ?? 'Sin proveedor',
    empleado: `${compra.idEmpleadoNavigation?.nombre ?? 'Desconocido'} ${compra.idEmpleadoNavigation?.apellidoPaterno ?? ''}`.trim(),
    tipoPago: compra.tipoPago ?? 'N/D',
    monto: Number(compra.monto ?? 0),
    cantidadProductos: (compra.detalleCompras ?? []).reduce((acc: number, item: any) => acc + Number(item.cantidad ?? 0), 0)
  }))
)

const inventarioAgrupado = computed(() => {
  const mapa = new Map<string, any>()

  for (const item of inventarioResult.value?.inventarios ?? []) {
    const clave = item.ubicacion === 'Piso de Ventas'
      ? `${item.codProducto}-Piso`
      : `${item.codProducto}-Almacen-${item.idAlmacen ?? 'sin-almacen'}`

    if (!mapa.has(clave)) {
      mapa.set(clave, {
        codProducto: item.codProducto,
        producto: item.codProductoNavigation?.nombre ?? 'Producto',
        ubicacion: item.ubicacion === 'Piso de Ventas' ? 'Piso de Ventas' : item.idAlmacenNavigation?.nombre ?? 'Almacén',
        cantidad: Number(item.cantidad ?? 0)
      })
    } else {
      mapa.get(clave).cantidad += Number(item.cantidad ?? 0)
    }
  }

  return Array.from(mapa.values()).sort((a, b) => a.producto.localeCompare(b.producto))
})

const ventasFiltradas = computed(() =>
  ventas.value.filter(venta => isWithinRange(venta.fecha, filtros.value.fechaInicio, filtros.value.fechaFin))
)

const comprasFiltradas = computed(() =>
  compras.value.filter(compra => isWithinRange(compra.fecha, filtros.value.fechaInicio, filtros.value.fechaFin))
)

const resumen = computed(() => {
  const totalVentas = ventasFiltradas.value.reduce((acc, item) => acc + item.monto, 0)
  const totalCompras = comprasFiltradas.value.reduce((acc, item) => acc + item.monto, 0)

  return {
    totalVentas,
    totalCompras,
    utilidadBruta: totalVentas - totalCompras,
    cantidadVentas: ventasFiltradas.value.length,
    cantidadCompras: comprasFiltradas.value.length,
    ticketPromedio: ventasFiltradas.value.length > 0 ? totalVentas / ventasFiltradas.value.length : 0,
    unidadesInventario: inventarioAgrupado.value.reduce((acc, item) => acc + item.cantidad, 0)
  }
})

const topVentas = computed(() =>
  [...ventasFiltradas.value]
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5)
)

const topCompras = computed(() =>
  [...comprasFiltradas.value]
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5)
)

const topInventario = computed(() =>
  [...inventarioAgrupado.value]
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)
)

function isWithinRange(dateValue: string, start: string, end: string) {
  if (!dateValue) return false
  return dateValue >= start && dateValue <= end
}

function formatCurrency(value: number | string | null | undefined) {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2
  }).format(Number(value ?? 0))
}

function formatNumber(value: number | string | null | undefined) {
  return new Intl.NumberFormat('es-GT').format(Number(value ?? 0))
}

function periodoTexto() {
  return `${filtros.value.fechaInicio} a ${filtros.value.fechaFin}`
}

async function refrescarDatos() {
  await Promise.all([refetchVentas(), refetchCompras(), refetchInventario()])
}

function imprimirVista() {
  window.print()
}

async function exportarVentasPDF() {
  await exportarReportePDF({
    titulo: 'Reporte de Ventas',
    subtitulo: 'Movimientos de ventas filtrados por periodo',
    periodo: periodoTexto(),
    resumen: [
      { label: 'Cantidad de ventas', value: formatNumber(resumen.value.cantidadVentas) },
      { label: 'Ingresos totales', value: formatCurrency(resumen.value.totalVentas) },
      { label: 'Ticket promedio', value: formatCurrency(resumen.value.ticketPromedio) }
    ],
    columnas: ['ID', 'Fecha', 'Hora', 'Cliente', 'Empleado', 'Productos', 'Monto'],
    filas: ventasFiltradas.value.map(venta => [
      venta.idVenta,
      venta.fecha,
      venta.hora,
      venta.cliente,
      venta.empleado,
      venta.cantidadProductos,
      formatCurrency(venta.monto)
    ]),
    archivo: `reporte_ventas_${today}.pdf`
  })
}

async function exportarComprasPDF() {
  await exportarReportePDF({
    titulo: 'Reporte de Compras',
    subtitulo: 'Compras registradas por periodo',
    periodo: periodoTexto(),
    resumen: [
      { label: 'Cantidad de compras', value: formatNumber(resumen.value.cantidadCompras) },
      { label: 'Compras totales', value: formatCurrency(resumen.value.totalCompras) },
      { label: 'Utilidad bruta estimada', value: formatCurrency(resumen.value.utilidadBruta) }
    ],
    columnas: ['ID', 'Fecha', 'Proveedor', 'Empleado', 'Pago', 'Productos', 'Monto'],
    filas: comprasFiltradas.value.map(compra => [
      compra.idCompra,
      compra.fecha,
      compra.proveedor,
      compra.empleado,
      compra.tipoPago,
      compra.cantidadProductos,
      formatCurrency(compra.monto)
    ]),
    archivo: `reporte_compras_${today}.pdf`
  })
}

async function exportarInventarioPDF() {
  await exportarReportePDF({
    titulo: 'Reporte de Inventario',
    subtitulo: 'Existencias consolidadas por ubicación',
    periodo: `Generado el ${today}`,
    resumen: [
      { label: 'Registros visibles', value: formatNumber(inventarioAgrupado.value.length) },
      { label: 'Unidades en inventario', value: formatNumber(resumen.value.unidadesInventario) }
    ],
    columnas: ['Código', 'Producto', 'Ubicación', 'Cantidad'],
    filas: inventarioAgrupado.value.map(item => [
      item.codProducto ?? 'N/D',
      item.producto,
      item.ubicacion,
      formatNumber(item.cantidad)
    ]),
    archivo: `reporte_inventario_${today}.pdf`
  })
}

onMounted(async () => {
  await refrescarDatos()
})

onActivated(async () => {
  await refrescarDatos()
})
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :paths="[{ route: '/reportes', parameters: [], text: 'Reportes' }]" />
    </template>

    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Reportería</h2>
        <p class="text-sm text-gray-500 dark:text-gray-300">
          Filtra por fechas y genera reportes imprimibles de ventas, compras e inventario.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button class="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-800" @click="imprimirVista">
          <FontAwesomeIcon :icon="faPrint" class="mr-2" />
          Imprimir vista
        </button>
        <button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" @click="refrescarDatos">
          Actualizar
        </button>
      </div>
    </div>

    <section class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div class="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <label class="flex flex-col gap-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Fecha inicial</span>
          <input v-model="filtros.fechaInicio" type="date" class="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Fecha final</span>
          <input v-model="filtros.fechaFin" type="date" class="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
        </label>

        <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/60">
          <p class="text-sm text-gray-500 dark:text-gray-400">Ventas</p>
          <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(resumen.totalVentas) }}</p>
        </div>

        <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/60">
          <p class="text-sm text-gray-500 dark:text-gray-400">Compras</p>
          <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(resumen.totalCompras) }}</p>
        </div>

        <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/60">
          <p class="text-sm text-gray-500 dark:text-gray-400">Utilidad bruta</p>
          <p class="mt-2 text-2xl font-bold" :class="resumen.utilidadBruta >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'">
            {{ formatCurrency(resumen.utilidadBruta) }}
          </p>
        </div>
      </div>
    </section>

    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-300">
      Cargando reportes...
    </div>

    <div v-else class="space-y-6">
      <section class="grid gap-6 xl:grid-cols-3">
        <article class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Reporte de ventas</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Resumen filtrado de ingresos y tickets.</p>
            </div>
            <FontAwesomeIcon :icon="faCashRegister" class="text-2xl text-emerald-600" />
          </div>

          <div class="mt-4 space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">Ventas encontradas: <strong>{{ formatNumber(resumen.cantidadVentas) }}</strong></p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Ticket promedio: <strong>{{ formatCurrency(resumen.ticketPromedio) }}</strong></p>
          </div>

          <button class="mt-5 w-full rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700" @click="exportarVentasPDF">
            <FontAwesomeIcon :icon="faFileArrowDown" class="mr-2" />
            Exportar PDF de ventas
          </button>
        </article>

        <article class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Reporte de compras</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Compras por proveedor, empleado y pago.</p>
            </div>
            <FontAwesomeIcon :icon="faShoppingCart" class="text-2xl text-fuchsia-600" />
          </div>

          <div class="mt-4 space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">Compras encontradas: <strong>{{ formatNumber(resumen.cantidadCompras) }}</strong></p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Monto comprado: <strong>{{ formatCurrency(resumen.totalCompras) }}</strong></p>
          </div>

          <button class="mt-5 w-full rounded bg-fuchsia-600 px-4 py-2 text-white hover:bg-fuchsia-700" @click="exportarComprasPDF">
            <FontAwesomeIcon :icon="faFileArrowDown" class="mr-2" />
            Exportar PDF de compras
          </button>
        </article>

        <article class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Reporte de inventario</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Existencias consolidadas listas para imprimir.</p>
            </div>
            <FontAwesomeIcon :icon="faBoxArchive" class="text-2xl text-indigo-600" />
          </div>

          <div class="mt-4 space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">Registros visibles: <strong>{{ formatNumber(inventarioAgrupado.length) }}</strong></p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Unidades: <strong>{{ formatNumber(resumen.unidadesInventario) }}</strong></p>
          </div>

          <button class="mt-5 w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700" @click="exportarInventarioPDF">
            <FontAwesomeIcon :icon="faFileArrowDown" class="mr-2" />
            Exportar PDF de inventario
          </button>
        </article>
      </section>

      <section class="grid gap-6 xl:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Top ventas</h3>
          <div class="mt-4 space-y-3">
            <div v-for="venta in topVentas" :key="venta.idVenta" class="rounded-xl bg-gray-50 p-3 dark:bg-gray-900/50">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">Venta #{{ venta.idVenta }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ venta.fecha }} · {{ venta.cliente }}</p>
                </div>
                <span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">{{ formatCurrency(venta.monto) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Top compras</h3>
          <div class="mt-4 space-y-3">
            <div v-for="compra in topCompras" :key="compra.idCompra" class="rounded-xl bg-gray-50 p-3 dark:bg-gray-900/50">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">Compra #{{ compra.idCompra }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ compra.fecha }} · {{ compra.proveedor }}</p>
                </div>
                <span class="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">{{ formatCurrency(compra.monto) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Top inventario</h3>
          <div class="mt-4 space-y-3">
            <div v-for="item in topInventario" :key="`${item.codProducto}-${item.ubicacion}`" class="rounded-xl bg-gray-50 p-3 dark:bg-gray-900/50">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ item.producto }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.ubicacion }}</p>
                </div>
                <span class="text-sm font-bold text-indigo-700 dark:text-indigo-300">{{ formatNumber(item.cantidad) }} uds.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Vista previa consolidada</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Resumen rápido de los datos que se están usando en los reportes.</p>
          </div>
          <FontAwesomeIcon :icon="faReceipt" class="text-2xl text-slate-600 dark:text-slate-300" />
        </div>

        <div class="mt-5 grid gap-6 xl:grid-cols-3">
          <div>
            <h4 class="mb-3 font-semibold text-gray-900 dark:text-white">Ventas</h4>
            <div class="space-y-2">
              <div v-for="venta in ventasFiltradas.slice(0, 5)" :key="venta.idVenta" class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-900/50">
                <span>#{{ venta.idVenta }} · {{ venta.fecha }}</span>
                <span class="font-semibold">{{ formatCurrency(venta.monto) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="mb-3 font-semibold text-gray-900 dark:text-white">Compras</h4>
            <div class="space-y-2">
              <div v-for="compra in comprasFiltradas.slice(0, 5)" :key="compra.idCompra" class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-900/50">
                <span>#{{ compra.idCompra }} · {{ compra.fecha }}</span>
                <span class="font-semibold">{{ formatCurrency(compra.monto) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="mb-3 font-semibold text-gray-900 dark:text-white">Inventario</h4>
            <div class="space-y-2">
              <div v-for="item in inventarioAgrupado.slice(0, 5)" :key="`${item.codProducto}-${item.ubicacion}`" class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-900/50">
                <span>{{ item.producto }}</span>
                <span class="font-semibold">{{ formatNumber(item.cantidad) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Page>
</template>
