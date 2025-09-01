"use client"

import { Sidebar } from "@/components/Sidebar"
import { LoadingOverlay } from "@/components/ui/loading"
import { useAuth } from "@/contexts/AuthContext"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-auto">
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
