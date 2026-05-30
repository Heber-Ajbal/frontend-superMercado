<script setup lang="ts">
import { computed, onActivated, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowTrendUp,
  faBox,
  faCashRegister,
  faChartColumn,
  faScaleBalanced,
  faShoppingCart,
  faTriangleExclamation,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'
import GetDashboardResumen from '~/api/dashboard/getDashboardResumen.gql'
import { useAuthStore } from '~/stores/auth'
import { normalizeRole } from '~/utils/roleAccess'

const auth = useAuthStore()

const { result, loading, error, refetch } = useQuery(GetDashboardResumen, null, {
  fetchPolicy: 'network-only'
})

const resumen = computed(() => result.value?.dashboardResumen)
const currentRole = computed(() => normalizeRole(auth.user?.rol))

const kpisPrincipales = computed(() => {
  if (!resumen.value) {
    return []
  }

  return [
    {
      label: 'Ingresos de hoy',
      value: formatCurrency(resumen.value.ingresosHoy),
      hint: `${resumen.value.ventasHoy} ventas registradas`,
      icon: faCashRegister,
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Ingresos del mes',
      value: formatCurrency(resumen.value.ingresosMes),
      hint: `Compras del mes: ${formatCurrency(resumen.value.comprasMes)}`,
      icon: faArrowTrendUp,
      accent: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Ticket promedio',
      value: formatCurrency(resumen.value.ticketPromedioHoy),
      hint: 'Promedio por venta del día',
      icon: faChartColumn,
      accent: 'from-violet-500 to-fuchsia-600'
    },
    {
      label: 'Inventario total',
      value: `${formatNumber(resumen.value.unidadesInventario)} uds.`,
      hint: `${formatNumber(resumen.value.unidadesPisoVentas)} en piso y ${formatNumber(resumen.value.unidadesBodega)} en bodega`,
      icon: faWarehouse,
      accent: 'from-amber-500 to-orange-600'
    }
  ]
})

const metricasSecundarias = computed(() => {
  if (!resumen.value) {
    return []
  }

  return [
    { label: 'Clientes', value: formatNumber(resumen.value.totalClientes) },
    { label: 'Productos', value: formatNumber(resumen.value.totalProductos) },
    { label: 'Proveedores', value: formatNumber(resumen.value.totalProveedores) },
    { label: 'Empleados', value: formatNumber(resumen.value.totalEmpleados) },
    { label: 'Compras hoy', value: formatNumber(resumen.value.comprasHoy) },
    { label: 'Ventas hoy', value: formatNumber(resumen.value.ventasHoy) },
    { label: 'Sin stock', value: formatNumber(resumen.value.productosSinStock) },
    { label: 'Stock bajo', value: formatNumber(resumen.value.productosStockBajo) }
  ]
})

const saludInventario = computed(() => {
  if (!resumen.value) {
    return []
  }

  return [
    {
      label: 'Costo estimado del inventario',
      value: formatCurrency(resumen.value.valorInventarioCosto),
      tone: 'text-slate-700 dark:text-slate-200'
    },
    {
      label: 'Valor a precio de venta',
      value: formatCurrency(resumen.value.valorInventarioVenta),
      tone: 'text-blue-700 dark:text-blue-300'
    },
    {
      label: 'Utilidad potencial',
      value: formatCurrency(resumen.value.utilidadPotencialInventario),
      tone: 'text-emerald-700 dark:text-emerald-300'
    }
  ]
})

const maxVentasMonto = computed(() =>
  Math.max(...(resumen.value?.ventasUltimos7Dias?.map((item: any) => Number(item.monto) || 0) ?? [0]), 1)
)

const maxComprasMonto = computed(() =>
  Math.max(...(resumen.value?.comprasUltimos7Dias?.map((item: any) => Number(item.monto) || 0) ?? [0]), 1)
)

const maxVentasOperaciones = computed(() =>
  Math.max(...(resumen.value?.ventasUltimos7Dias?.map((item: any) => Number(item.operaciones) || 0) ?? [0]), 1)
)

const maxComprasOperaciones = computed(() =>
  Math.max(...(resumen.value?.comprasUltimos7Dias?.map((item: any) => Number(item.operaciones) || 0) ?? [0]), 1)
)

const balanceSemanal = computed(() =>
  (resumen.value?.ventasUltimos7Dias ?? []).map((venta: any, index: number) => {
    const compra = resumen.value?.comprasUltimos7Dias?.[index]
    const ventasMonto = Number(venta?.monto ?? 0)
    const comprasMonto = Number(compra?.monto ?? 0)
    const neto = ventasMonto - comprasMonto

    return {
      fecha: venta?.fecha ?? compra?.fecha,
      ventasMonto,
      comprasMonto,
      neto
    }
  })
)

const maxBalance = computed(() =>
  Math.max(...balanceSemanal.value.map(item => Math.abs(item.neto)), 1)
)

const topProductoMax = computed(() =>
  Math.max(...(resumen.value?.topProductosVendidos?.map((item: any) => Number(item.cantidadVendida) || 0) ?? [0]), 1)
)

const inventoryDistribution = computed(() => {
  if (!resumen.value) {
    return { pisoPct: 0, bodegaPct: 0, riesgoPct: 0, saludablePct: 0 }
  }

  const totalUnits = Math.max(Number(resumen.value.unidadesInventario ?? 0), 1)
  const totalProducts = Math.max(Number(resumen.value.totalProductos ?? 0), 1)

  return {
    pisoPct: Math.round((Number(resumen.value.unidadesPisoVentas ?? 0) / totalUnits) * 100),
    bodegaPct: Math.round((Number(resumen.value.unidadesBodega ?? 0) / totalUnits) * 100),
    riesgoPct: Math.round((Number(resumen.value.productosStockBajo ?? 0) / totalProducts) * 100),
    saludablePct: Math.max(
      0,
      100 - Math.round((Number(resumen.value.productosStockBajo ?? 0) / totalProducts) * 100)
    )
  }
})

function formatCurrency(value: number | string | null | undefined) {
  return `Q${new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value ?? 0))}`
}

function formatNumber(value: number | string | null | undefined) {
  return new Intl.NumberFormat('es-GT').format(Number(value ?? 0))
}

function formatShortDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: 'short'
  }).format(date)
}

function percentageWidth(value: number, max: number) {
  return `${Math.max(value > 0 ? 8 : 0, Math.round((value / Math.max(max, 1)) * 100))}%`
}

onMounted(async () => {
  await refetch()
})

onActivated(async () => {
  await refetch()
})
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl dark:border-slate-700 md:px-10 md:py-10">
    <div class="absolute inset-0 opacity-30">
      <div class="absolute -left-12 top-8 h-40 w-40 rounded-full bg-cyan-400 blur-3xl" />
      <div class="absolute right-0 top-0 h-52 w-52 rounded-full bg-blue-500 blur-3xl" />
      <div class="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-emerald-400 blur-3xl" />
    </div>

    <div class="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
      <div>
        <p class="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-100">
          Dashboard operativo
        </p>
        <h1 class="max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
          Sistema de Supermarket E.H.N
        </h1>
        <p class="mt-4 max-w-2xl text-sm text-slate-200 md:text-base">
          Vista rápida del negocio con ventas, compras, salud del inventario y alertas de abastecimiento.
        </p>
        <p class="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
          Rol actual: {{ currentRole }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-300">Ventas hoy</p>
          <p class="mt-2 text-2xl font-bold">{{ formatNumber(resumen?.ventasHoy) }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-300">Compras hoy</p>
          <p class="mt-2 text-2xl font-bold">{{ formatNumber(resumen?.comprasHoy) }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-300">Sin stock</p>
          <p class="mt-2 text-2xl font-bold">{{ formatNumber(resumen?.productosSinStock) }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-300">Stock bajo</p>
          <p class="mt-2 text-2xl font-bold">{{ formatNumber(resumen?.productosStockBajo) }}</p>
        </div>
      </div>
    </div>
  </section>

  <div v-if="loading" class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="placeholder in 8"
      :key="placeholder"
      class="h-40 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
    />
  </div>

  <div
    v-else-if="error"
    class="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
  >
    No se pudo cargar el dashboard. Revisa la conexión con el backend e inténtalo de nuevo.
  </div>

  <div v-else-if="resumen" class="mt-8 space-y-8">
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="kpi in kpisPrincipales"
        :key="kpi.label"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
      >
        <div :class="['h-2 bg-gradient-to-r', kpi.accent]" />
        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-300">{{ kpi.label }}</p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ kpi.value }}</p>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ kpi.hint }}</p>
            </div>
            <div class="rounded-xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
              <FontAwesomeIcon :icon="kpi.icon" class="text-lg" />
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Flujo monetario de 7 días</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Comparativo visual entre ventas y compras.</p>
          </div>
          <div class="rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <FontAwesomeIcon :icon="faChartColumn" />
          </div>
        </div>

        <div class="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Ventas
            </h3>
            <div class="space-y-3">
              <div
                v-for="item in resumen.ventasUltimos7Dias"
                :key="`venta-${item.fecha}`"
                class="grid grid-cols-[56px_1fr_auto] items-center gap-3"
              >
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ formatShortDate(item.fecha) }}</span>
                <div class="h-3 rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    class="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    :style="{ width: percentageWidth(Number(item.monto), maxVentasMonto) }"
                  />
                </div>
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ formatCurrency(item.monto) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Compras
            </h3>
            <div class="space-y-3">
              <div
                v-for="item in resumen.comprasUltimos7Dias"
                :key="`compra-${item.fecha}`"
                class="grid grid-cols-[56px_1fr_auto] items-center gap-3"
              >
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ formatShortDate(item.fecha) }}</span>
                <div class="h-3 rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    class="h-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
                    :style="{ width: percentageWidth(Number(item.monto), maxComprasMonto) }"
                  />
                </div>
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ formatCurrency(item.monto) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Salud del inventario</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Lectura rápida del valor y cobertura actual.</p>

        <div class="mt-5 space-y-4">
          <div
            v-for="item in saludInventario"
            :key="item.label"
            class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.label }}</p>
            <p :class="['mt-1 text-2xl font-bold', item.tone]">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Ritmo de operaciones</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Cantidad de ventas y compras por día.</p>
          </div>
          <div class="rounded-full bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
            <FontAwesomeIcon :icon="faShoppingCart" />
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <div
            v-for="(item, index) in resumen.ventasUltimos7Dias"
            :key="`ops-${item.fecha}`"
            class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60"
          >
            <div class="mb-3 flex items-center justify-between">
              <p class="font-semibold text-gray-900 dark:text-white">{{ formatShortDate(item.fecha) }}</p>
              <p class="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Operaciones</p>
            </div>

            <div class="space-y-2">
              <div class="grid grid-cols-[72px_1fr_auto] items-center gap-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Ventas</span>
                <div class="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    :style="{ width: percentageWidth(Number(item.operaciones), maxVentasOperaciones) }"
                  />
                </div>
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ item.operaciones }}</span>
              </div>

              <div class="grid grid-cols-[72px_1fr_auto] items-center gap-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">Compras</span>
                <div class="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
                    :style="{ width: percentageWidth(Number(resumen.comprasUltimos7Dias[index]?.operaciones ?? 0), maxComprasOperaciones) }"
                  />
                </div>
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ resumen.comprasUltimos7Dias[index]?.operaciones ?? 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Balance diario</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Diferencia neta entre ventas y compras por día.</p>
          </div>
          <div class="rounded-full bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <FontAwesomeIcon :icon="faScaleBalanced" />
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <div
            v-for="item in balanceSemanal"
            :key="`balance-${item.fecha}`"
            class="grid grid-cols-[60px_1fr_auto] items-center gap-3"
          >
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ formatShortDate(item.fecha) }}</span>
            <div class="rounded-full bg-gray-100 p-1 dark:bg-gray-700">
              <div
                class="h-4 rounded-full"
                :class="item.neto >= 0 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-rose-500 to-red-500'"
                :style="{ width: percentageWidth(Math.abs(item.neto), maxBalance) }"
              />
            </div>
            <span
              class="text-xs font-semibold"
              :class="item.neto >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'"
            >
              {{ formatCurrency(item.neto) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Productos más vendidos</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Top por unidades acumuladas.</p>

        <div class="mt-5 space-y-3">
          <div
            v-for="(producto, index) in resumen.topProductosVendidos"
            :key="producto.codProducto ?? index"
            class="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate font-semibold text-gray-900 dark:text-white">
                  {{ index + 1 }}. {{ producto.nombre }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Código: {{ producto.codProducto ?? 'N/D' }}</p>
              </div>
              <div class="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {{ formatNumber(producto.cantidadVendida) }} uds.
              </div>
            </div>

            <div class="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                class="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                :style="{ width: percentageWidth(Number(producto.cantidadVendida), topProductoMax) }"
              />
            </div>
          </div>

          <p
            v-if="resumen.topProductosVendidos.length === 0"
            class="rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
          >
            Aún no hay ventas registradas para calcular el top de productos.
          </p>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Alertas de stock</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Productos con poco stock en piso de ventas.</p>
          </div>
          <div class="rounded-full bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
            <FontAwesomeIcon :icon="faTriangleExclamation" />
          </div>
        </div>

        <div class="mt-5 space-y-3">
          <div
            v-for="(producto, index) in resumen.productosBajoStock"
            :key="producto.codProducto ?? index"
            class="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate font-semibold text-gray-900 dark:text-white">{{ producto.nombre }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Stock total: {{ formatNumber(producto.stockTotal) }} uds.</p>
              </div>
              <div
                class="rounded-full px-3 py-1 text-sm font-bold"
                :class="producto.stockPisoVentas === 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'"
              >
                Piso: {{ formatNumber(producto.stockPisoVentas) }}
              </div>
            </div>
          </div>

          <p
            v-if="resumen.productosBajoStock.length === 0"
            class="rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
          >
            No hay productos con stock bajo en piso de ventas.
          </p>
        </div>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Distribución del inventario</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Participación de piso, bodega y riesgo de quiebre.</p>
          </div>
          <div class="rounded-full bg-orange-50 p-3 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
            <FontAwesomeIcon :icon="faBox" />
          </div>
        </div>

        <div class="mt-6 space-y-6">
          <div>
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-semibold text-gray-700 dark:text-gray-200">Piso vs bodega</span>
              <span class="text-gray-500 dark:text-gray-400">{{ inventoryDistribution.pisoPct }}% / {{ inventoryDistribution.bodegaPct }}%</span>
            </div>
            <div class="flex h-5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div class="bg-gradient-to-r from-blue-500 to-cyan-500" :style="{ width: `${inventoryDistribution.pisoPct}%` }" />
              <div class="bg-gradient-to-r from-amber-400 to-orange-500" :style="{ width: `${inventoryDistribution.bodegaPct}%` }" />
            </div>
          </div>

          <div>
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-semibold text-gray-700 dark:text-gray-200">Productos en riesgo</span>
              <span class="text-gray-500 dark:text-gray-400">{{ inventoryDistribution.riesgoPct }}%</span>
            </div>
            <div class="flex h-5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div class="bg-gradient-to-r from-rose-500 to-red-500" :style="{ width: `${inventoryDistribution.riesgoPct}%` }" />
              <div class="bg-gradient-to-r from-emerald-400 to-green-500" :style="{ width: `${inventoryDistribution.saludablePct}%` }" />
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
              <p class="text-sm text-gray-500 dark:text-gray-400">Unidades en piso</p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(resumen.unidadesPisoVentas) }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
              <p class="text-sm text-gray-500 dark:text-gray-400">Unidades en bodega</p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(resumen.unidadesBodega) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Indicadores rápidos</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Contadores clave del sistema para operación diaria.</p>

        <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="item in metricasSecundarias"
            :key="item.label"
            class="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.label }}</p>
            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
