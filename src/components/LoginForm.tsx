"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"

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

export function LoginForm({ onSubmit, title = "Formulario de Acceso" }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nit: "",
    password: "",
    startDate: undefined,
    endDate: undefined
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">Fecha Final</Label>
              <DatePicker
                date={formData.endDate}
                onDateChange={(date) => handleInputChange('endDate', date)}
                placeholder="Fecha final"
              />
            </div>
          </div>

          {/* Botón de envío */}
          <Button type="submit" className="w-full" size="lg">
            Enviar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
