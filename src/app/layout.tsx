import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PageLoader } from '@/components/ui/loading'
import { AuthProvider } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Contasync - Automatización Inteligente de Contabilidad',
  description: 'Sistema de automatización de facturas, descargas DIAN y agente de contabilización IA. Integración completa con Siigo.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <SidebarProvider>
            <PageLoader>
              {children}
            </PageLoader>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
