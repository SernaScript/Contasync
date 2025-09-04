"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Lock
} from "lucide-react"

interface FormData {
  nit: string
  password: string
}

interface LoginFormNewProps {
  onSubmit?: (data: FormData) => void
  title?: string
}

export function LoginFormNew({ onSubmit, title = "Formulario de Acceso" }: LoginFormNewProps) {
  const [formData, setFormData] = useState<FormData>({
    nit: "",
    password: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; error?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que todos los campos estén llenos
    if (!formData.nit || !formData.password) {
      setResult({
        success: false,
        message: "Por favor completa todos los campos",
        error: "Campos requeridos"
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      // Llamar al callback si existe
      if (onSubmit) {
        onSubmit(formData)
      }

      setResult({
        success: true,
        message: "Formulario enviado exitosamente"
      })

    } catch (error) {
      setResult({
        success: false,
        message: "Error al procesar el formulario",
        error: error instanceof Error ? error.message : "Error desconocido"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NIT */}
            <div className="space-y-2">
              <Label htmlFor="nit" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                NIT de la Empresa
              </Label>
              <Input
                id="nit"
                type="text"
                placeholder="Ej: 900123456-1"
                value={formData.nit}
                onChange={(e) => handleInputChange('nit', e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* Botón de envío */}
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              className="w-full"
              disabled={!formData.nit || !formData.password}
            >
              {isLoading ? "Procesando..." : "Enviar"}
            </LoadingButton>
          </form>

          {/* Resultado */}
          {result && (
            <div className={`mt-4 p-3 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {result.success ? "Éxito" : "Error"}
                </span>
              </div>
              <p className="text-sm mt-1">{result.message}</p>
              {result.error && (
                <p className="text-xs mt-1 opacity-75">{result.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}