"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Info } from "lucide-react"
import Link from "next/link"

export default function AutomatizacionF2XRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/areas/contabilidad/automatizacion-f2x")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Info className="h-8 w-8 text-blue-600" />
          </div>
        </div>
            <CardTitle className="text-2xl">Módulo Reubicado</CardTitle>
            <CardDescription className="text-lg">
              El módulo de Automatización F2X se ha movido a su nueva ubicación dentro del área de Contabilidad
              </CardDescription>
              </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nueva ubicación:</strong> Contabilidad → Automatización F2X
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Serás redirigido automáticamente en 5 segundos...
              </p>
          </div>

            <div className="space-y-3">
              <Link href="/areas/contabilidad/automatizacion-f2x">
                <Button size="lg" className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Ir al Módulo F2X
                </Button>
              </Link>
              
              <Link href="/areas/contabilidad">
                <Button variant="outline" size="lg" className="w-full">
                  Ver Área de Contabilidad
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="ghost" size="lg" className="w-full">
                  Volver al Inicio
                </Button>
              </Link>
        </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Como parte de la nueva organización por áreas, todos los módulos relacionados con contabilidad 
                se encuentran ahora agrupados en el área correspondiente para una mejor organización y navegación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
