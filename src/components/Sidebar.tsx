"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useSidebar } from "@/contexts/SidebarContext"
import { 
  Home, 
  Settings, 
  BarChart3,
  Users,
  Download,
  FileText,
  CreditCard,
  ArrowRightLeft,
  Bot,
  ChevronLeft,
  ChevronRight
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
    name: "Automatización F2X",
    href: "/services/f2x-automation",
    icon: Bot,
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
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 relative">
          {!isCollapsed && (
            <>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Contasync
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Panel de Control
              </p>
            </>
          )}
          
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="absolute top-4 right-2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-1">
                Navegación Principal
              </p>
            )}
            
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full text-left transition-all duration-200",
                      isCollapsed ? "justify-center px-2" : "justify-start gap-2",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Card className="p-3">
            {!isCollapsed ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Versión 1.0.0
              </p>
            ) : (
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
