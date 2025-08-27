"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface FormData {
  nit: string
  password: string
  startDate?: Date
  endDate?: Date
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

export function LoginForm({ onSubmit, title = "Formulario de Acceso" }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nit: "",
    password: "",
    startDate: undefined,
    endDate: undefined
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScrapingResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que todos los campos estén llenos
    if (!formData.nit || !formData.password || !formData.startDate || !formData.endDate) {
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
      // Formatear las fechas para enviar al API
      const payload = {
        nit: formData.nit,
        password: formData.password,
        startDate: format(formData.startDate, 'yyyy-MM-dd'),
        endDate: format(formData.endDate, 'yyyy-MM-dd')
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

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar resultado cuando se cambian los datos
    if (result) {
      setResult(null)
    }
  }

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

          {/* Rango de Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Fecha Inicial</Label>
              <DatePicker
                date={formData.startDate}
                onDateChange={(date) => handleInputChange('startDate', date)}
                placeholder="Fecha inicial"
                className={isLoading ? "opacity-50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">Fecha Final</Label>
              <DatePicker
                date={formData.endDate}
                onDateChange={(date) => handleInputChange('endDate', date)}
                placeholder="Fecha final"
                className={isLoading ? "opacity-50" : ""}
              />
            </div>
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
