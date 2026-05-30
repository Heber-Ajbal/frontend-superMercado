export type AppRole = 'Administrador' | 'Supervisor' | 'Cajero' | 'Encargado de Almacén' | 'Desconocido'

type RouteRule = {
  prefix: string
  roles: AppRole[]
}

const ALL_ROLES: AppRole[] = ['Administrador', 'Supervisor', 'Cajero', 'Encargado de Almacén']
const ADMIN_LIKE_ROLES: AppRole[] = ['Administrador', 'Supervisor']

const routeRules: RouteRule[] = [
  { prefix: '/dashboard', roles: ALL_ROLES },
  { prefix: '/usuarios', roles: ADMIN_LIKE_ROLES },
  { prefix: '/empleados', roles: ADMIN_LIKE_ROLES },
  { prefix: '/ventas', roles: [...ADMIN_LIKE_ROLES, 'Cajero'] },
  { prefix: '/clientes', roles: [...ADMIN_LIKE_ROLES, 'Cajero'] },
  { prefix: '/inventario', roles: [...ADMIN_LIKE_ROLES, 'Encargado de Almacén'] },
  { prefix: '/compras', roles: [...ADMIN_LIKE_ROLES, 'Encargado de Almacén'] },
  { prefix: '/productos', roles: [...ADMIN_LIKE_ROLES, 'Encargado de Almacén'] },
  { prefix: '/proveedores', roles: [...ADMIN_LIKE_ROLES, 'Encargado de Almacén'] },
  { prefix: '/categorias', roles: [...ADMIN_LIKE_ROLES, 'Encargado de Almacén'] },
  { prefix: '/', roles: ALL_ROLES }
]

function normalizeRawRole(role: string | null | undefined) {
  return (role ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export function normalizeRole(role: string | null | undefined): AppRole {
  const normalized = normalizeRawRole(role)

  switch (normalized) {
    case 'administrador':
      return 'Administrador'
    case 'supervisor':
      return 'Supervisor'
    case 'cajero':
      return 'Cajero'
    case 'encargado de almacen':
      return 'Encargado de Almacén'
    default:
      return 'Desconocido'
  }
}

export function canAccessRoute(role: string | null | undefined, path: string) {
  const normalizedRole = normalizeRole(role)

  if (path === '/login') {
    return true
  }

  const matchedRule = [...routeRules]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find(rule => {
      if (rule.prefix === '/') {
        return path === '/'
      }

      return path === rule.prefix || path.startsWith(`${rule.prefix}/`)
    })

  if (!matchedRule) {
    return false
  }

  return matchedRule.roles.includes(normalizedRole)
}

export function isAdmin(role: string | null | undefined) {
  return normalizeRole(role) === 'Administrador'
}
