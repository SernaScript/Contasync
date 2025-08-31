import { 
  Calculator, 
  CreditCard, 
  Truck, 
  FileText, 
  Building2,
  PiggyBank,
  Receipt,
  FileBarChart,
  Users,
  DollarSign,
  Calendar,
  Package,
  ClipboardList,
  BarChart3,
  Zap,
  Settings
} from "lucide-react"

export interface Module {
  id: string
  name: string
  description: string
  icon: any
  href: string
  status?: 'active' | 'development' | 'planned'
}

export interface Area {
  id: string
  name: string
  description: string
  icon: any
  color: string
  modules: Module[]
}

export const areasConfig: Area[] = [
  {
    id: "contabilidad",
    name: "Contabilidad",
    description: "Gestión contable y financiera integral",
    icon: Calculator,
    color: "blue",
    modules: [
      {
        id: "automatizacion-f2x",
        name: "Automatización F2X",
        description: "Procesamiento automático de documentos F2X",
        icon: Zap,
        href: "/areas/contabilidad/automatizacion-f2x",
        status: 'active'
      },
      {
        id: "conciliacion",
        name: "Conciliación Bancaria",
        description: "Conciliación automática de cuentas bancarias",
        icon: Building2,
        href: "/areas/contabilidad/conciliacion",
        status: 'development'
      },
      {
        id: "facturas-electronicas",
        name: "Facturas Electrónicas",
        description: "Gestión y procesamiento de facturas electrónicas",
        icon: Receipt,
        href: "/areas/contabilidad/facturas-electronicas",
        status: 'development'
      },
      {
        id: "reportes-contables",
        name: "Reportes Contables",
        description: "Generación de reportes financieros y contables",
        icon: FileBarChart,
        href: "/areas/contabilidad/reportes",
        status: 'active'
      }
    ]
  },
  {
    id: "tesoreria",
    name: "Tesorería",
    description: "Administración de flujo de efectivo y pagos",
    icon: PiggyBank,
    color: "green",
    modules: [
      {
        id: "cartera",
        name: "Gestión de Cartera",
        description: "Control y seguimiento de cartera de clientes",
        icon: Users,
        href: "/areas/tesoreria/cartera",
        status: 'development'
      },
      {
        id: "programacion-pagos",
        name: "Programación de Pagos",
        description: "Planificación y programación de pagos a proveedores",
        icon: Calendar,
        href: "/areas/tesoreria/programacion-pagos",
        status: 'development'
      },
      {
        id: "flujo-efectivo",
        name: "Flujo de Efectivo",
        description: "Proyección y control del flujo de efectivo",
        icon: DollarSign,
        href: "/areas/tesoreria/flujo-efectivo",
        status: 'planned'
      },
      {
        id: "conciliacion-bancaria",
        name: "Conciliación Bancaria",
        description: "Conciliación de movimientos bancarios",
        icon: CreditCard,
        href: "/areas/tesoreria/conciliacion-bancaria",
        status: 'development'
      }
    ]
  },
  {
    id: "logistica",
    name: "Logística",
    description: "Gestión de inventarios y cadena de suministro",
    icon: Truck,
    color: "orange",
    modules: [
      {
        id: "inventarios",
        name: "Control de Inventarios",
        description: "Gestión y control de inventarios en tiempo real",
        icon: Package,
        href: "/areas/logistica/inventarios",
        status: 'development'
      },
      {
        id: "ordenes-compra",
        name: "Órdenes de Compra",
        description: "Gestión de órdenes de compra y proveedores",
        icon: ClipboardList,
        href: "/areas/logistica/ordenes-compra",
        status: 'development'
      },
      {
        id: "almacenes",
        name: "Gestión de Almacenes",
        description: "Control de almacenes y ubicaciones",
        icon: Building2,
        href: "/areas/logistica/almacenes",
        status: 'planned'
      },
      {
        id: "reportes-logistica",
        name: "Reportes de Logística",
        description: "Reportes de movimientos y rotación de inventarios",
        icon: BarChart3,
        href: "/areas/logistica/reportes",
        status: 'development'
      }
    ]
  },
  {
    id: "facturacion",
    name: "Facturación",
    description: "Emisión y gestión de facturación electrónica",
    icon: FileText,
    color: "purple",
    modules: [
      {
        id: "emision-facturas",
        name: "Emisión de Facturas",
        description: "Creación y emisión de facturas electrónicas",
        icon: FileText,
        href: "/areas/facturacion/emision-facturas",
        status: 'development'
      },
      {
        id: "notas-credito",
        name: "Notas de Crédito",
        description: "Gestión de notas de crédito y débito",
        icon: Receipt,
        href: "/areas/facturacion/notas-credito",
        status: 'development'
      },
      {
        id: "clientes",
        name: "Gestión de Clientes",
        description: "Administración de información de clientes",
        icon: Users,
        href: "/areas/facturacion/clientes",
        status: 'active'
      },
      {
        id: "reportes-facturacion",
        name: "Reportes de Facturación",
        description: "Análisis de ventas y facturación",
        icon: BarChart3,
        href: "/areas/facturacion/reportes",
        status: 'active'
      }
    ]
  }
]

// Helper functions
export const getAreaById = (id: string): Area | undefined => {
  return areasConfig.find(area => area.id === id)
}

export const getModuleById = (areaId: string, moduleId: string): Module | undefined => {
  const area = getAreaById(areaId)
  return area?.modules.find(module => module.id === moduleId)
}

export const getAreaByModuleHref = (href: string): Area | undefined => {
  return areasConfig.find(area => 
    area.modules.some(module => module.href === href)
  )
}

export const getModuleByHref = (href: string): Module | undefined => {
  for (const area of areasConfig) {
    const module = area.modules.find(m => m.href === href)
    if (module) return module
  }
  return undefined
}
