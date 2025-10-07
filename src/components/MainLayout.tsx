"use client"

import { Sidebar } from "@/components/Sidebar"
import { LoadingOverlay } from "@/components/ui/loading"
import { useAuth } from "@/contexts/AuthContext"
import { useSidebar } from "@/contexts/SidebarContext"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth()
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <LoadingOverlay 
          isLoading={isLoading} 
          text="Verificando autenticación..."
          spinnerSize="lg"
        >
          <div className="p-8">
            {children}
          </div>
        </LoadingOverlay>
      </main>
    </div>
  )
}
