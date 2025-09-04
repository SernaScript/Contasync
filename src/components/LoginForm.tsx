"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Lock, 
  Calendar,
  Download,
  Database
} from "lucide-react"

interface FormData {
  nit: string
  password: string
  processToDatabase: boolean
}

interface ScrapingResult {
  success: boolean
  message: string
  error?: string
  data?: {
    nit: string
    dateRange: string
    downloadTime: string
  }
}

interface LoginFormProps {
  onSubmit?: (data: FormData) => void
  title?: string
}

const getDateRange = () => {
  const today = new Date()
  const startDate = new Date()
  startDate.setDate(today.getDate() - 60)

  return {
    from: startDate,
    to: today
  }
}

export function LoginForm({ onSubmit, title = "Formulario de Acceso" }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nit: "",
    password: "",
    processToDatabase: true
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
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
        processToDatabase: formData.processToDatabase
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

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <Download className="h-6 w-6 text-orange-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Accede a F2X para descargar facturas automáticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo NIT */}
          <div className="space-y-2">
            <Label htmlFor="nit" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              NIT de la Empresa
            </Label>
            <Input
              id="nit"
              type="text"
              placeholder="Ej: 900123456-7"
              value={formData.nit}
              onChange={(e) => handleInputChange('nit', e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              className="w-full"
            />
          </div>

          {}
          <div className="flex items-center space-x-2">
            
            <Checkbox
              id="processToDatabase"
              checked={formData.processToDatabase}
              
              onCheckedChange={(checked : boolean) => handleInputChange('processToDatabase', checked as boolean)}
            />
            <Label htmlFor="processToDatabase" className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4" />
              Procesar en base de datos
            </Label>
          </div>

          {/* Información del rango de fechas */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Rango de fechas automático</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
              Últimos 60 días: {format(getDateRange().from, 'dd/MM/yyyy')} - {format(getDateRange().to, 'dd/MM/yyyy')}
            </p>
          </div>

          {/* Resultado del scraping */}
          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800'
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
          <LoadingButton 
            type="submit" 
            className="w-full" 
            size="lg"
            isLoading={isLoading}
            loadingText="Procesando..."
          >
            Iniciar Scraping F2X
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  )
}
