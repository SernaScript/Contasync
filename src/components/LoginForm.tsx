"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2, CheckCircle, AlertCircle, Calendar } from "lucide-react"

interface FormData {
  nit: string
  password: string
}

interface LoginFormProps {
  onSubmit?: (data: FormData) => void
  title?: string
}

interface ScrapingResult {
  success: boolean
  message: string
  data?: any
  error?: string
}

// Función para obtener el rango de fechas automático (últimos 60 días)
const getDateRange = () => {
  const today = new Date()
  const startDate = subDays(today, 60)
  return {
    from: startDate,
    to: today
  }
}

export function LoginForm({ onSubmit, title = "Formulario de Acceso" }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nit: "",
    password: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScrapingResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que todos los campos estén llenos
    if (!formData.nit || !formData.password) {
      setResult({
        success: false,
        message: "Todos los campos son requeridos",
        error: "Todos los campos son requeridos"
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      // Obtener el rango de fechas automático (últimos 60 días)
      const dateRange = getDateRange()
      
      // Formatear las fechas para enviar al API
      const payload = {
        nit: formData.nit,
        password: formData.password,
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd')
      }

      console.log('🚀 Enviando datos de scraping:', { ...payload, password: '***' })

      const response = await fetch('/api/flypass-scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data: ScrapingResult = await response.json()
      
      setResult(data)
      
      // Llamar callback si existe
      if (onSubmit) {
        onSubmit(formData)
      }

    } catch (error) {
      console.error('❌ Error enviando formulario:', error)
      setResult({
        success: false,
        message: 'Error de conexión. Inténtelo de nuevo.',
        error: 'Error de conexión. Inténtelo de nuevo.'
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
    
    // Limpiar resultado cuando se cambian los datos
    if (result) {
      setResult(null)
    }
  }

  // Obtener el rango de fechas actual para mostrar al usuario
  const currentDateRange = getDateRange()

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo NIT */}
          <div className="space-y-2">
            <Label htmlFor="nit">NIT</Label>
            <Input
              id="nit"
              type="text"
              placeholder="Ingrese su NIT"
              value={formData.nit}
              onChange={(e) => handleInputChange('nit', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Información del Rango de Fechas Automático */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Período de Consulta (Automático)
            </Label>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Se consultarán los últimos 60 días:</div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-600">Desde:</span>
                    <div className="font-semibold">{format(currentDateRange.from, "dd 'de' MMMM 'de' yyyy", { locale: es })}</div>
                  </div>
                  <div className="text-blue-400 mx-2">→</div>
                  <div>
                    <span className="text-xs text-blue-600">Hasta:</span>
                    <div className="font-semibold">{format(currentDateRange.to, "dd 'de' MMMM 'de' yyyy", { locale: es })}</div>
                  </div>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  Total de días: 61 días
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              El sistema consultará automáticamente las facturas de los últimos 60 días hasta hoy
            </p>
          </div>

          {/* Resultado del scraping */}
          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <p className="font-medium">
                  {result.success ? 'Éxito' : 'Error'}
                </p>
              </div>
              <p className="mt-1 text-sm">
                {result.message || result.error}
              </p>
              {result.data && (
                <div className="mt-2 text-xs">
                  <p>NIT: {result.data.nit}</p>
                  <p>Rango: {result.data.dateRange}</p>
                  <p>Procesado: {new Date(result.data.downloadTime).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {/* Botón de envío */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Iniciar Scraping F2X'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
