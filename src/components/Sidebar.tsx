"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Home, 
  Settings, 
  BarChart3,
  Users,
  Download,
  FileText,
  CreditCard,
  ArrowRightLeft
} from "lucide-react"

const mainNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Descarga de Facturas",
    href: "/invoice-downloads",
    icon: Download,
  },
  {
    name: "Migrar Facturas",
    href: "/migrate-invoices",
    icon: ArrowRightLeft,
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Planes",
    href: "/plans",
    icon: CreditCard,
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 z-40">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Contasync
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Panel de Control
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-1">
              Navegación Principal
            </p>
            
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 text-left",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Card className="p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Versión 1.0.0
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
