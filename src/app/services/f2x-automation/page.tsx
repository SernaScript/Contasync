"use client"

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  Download, 
  Bot,
  Calendar,
  Key,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  FileText
} from "lucide-react"

interface F2XForm {
  nit: string;
  password: string;
  startDate: string;
  endDate: string;
}

interface DatePickerState {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface ScrapingResult {
  success: boolean;
  message: string;
  data?: {
    nit: string;
    dateRange: string;
    downloadTime: string;
    downloadedFile?: string;
  };
  error?: string;
}

export default function F2XAutomationPage() {
  const [form, setForm] = useState<F2XForm>({
    nit: '',
    password: '',
    startDate: '',
    endDate: ''
  });
  const [datePickerState, setDatePickerState] = useState<DatePickerState>({
    startDate: undefined,
    endDate: undefined
  });
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null);

  const handleStartDateChange = (date: Date | undefined) => {
    setDatePickerState(prev => ({ ...prev, startDate: date }));
    if (date) {
      setForm(prev => ({
        ...prev,
        startDate: date.toISOString().split('T')[0]
      }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setDatePickerState(prev => ({ ...prev, endDate: date }));
    if (date) {
      setForm(prev => ({
        ...prev,
        endDate: date.toISOString().split('T')[0]
      }));
    }
  };

  const handleScraping = async () => {
    if (!form.nit || !form.password || !form.startDate || !form.endDate) {
      setScrapingResult({
        success: false,
        message: 'Por favor, completa todos los campos requeridos'
      });
      return;
    }

    setIsScraping(true);
    setScrapingResult(null);

    try {
      console.log('Enviando solicitud de scraping F2X:', {
        nit: form.nit,
        startDate: form.startDate,
        endDate: form.endDate
      });

      const response = await fetch('/api/flypass-scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      console.log('Estado de respuesta:', response.status);
      const result = await response.json();
      console.log('Resultado de respuesta:', result);

      if (result.success) {
        setScrapingResult({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        setScrapingResult({
          success: false,
          message: result.message || 'Error durante el scraping',
          error: result.error
        });
      }
    } catch (error) {
      setScrapingResult({
        success: false,
        message: 'Error de conexión durante el scraping F2X',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsScraping(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Automatización F2X
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Descarga automática de facturas desde Flypass
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración de Scraping
              </CardTitle>
              <CardDescription>
                Configura los parámetros para descargar facturas desde Flypass automáticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* NIT */}
              <div className="space-y-2">
                <Label htmlFor="nit" className="text-sm font-medium">
                  NIT
                </Label>
                <Input
                  id="nit"
                  type="text"
                  value={form.nit}
                  onChange={(e) => setForm(prev => ({ ...prev, nit: e.target.value }))}
                  placeholder="Ej: 900698993"
                  disabled={isScraping}
                  className="h-12"
                />
                <p className="text-xs text-gray-500">
                  Número de identificación tributaria
                </p>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Tu contraseña de Flypass"
                  disabled={isScraping}
                  className="h-12"
                />
                <p className="text-xs text-gray-500">
                  Contraseña de acceso al portal de Flypass
                </p>
              </div>

              {/* Fecha Inicial */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium">
                  Fecha Inicial
                </Label>
                <DatePicker
                  date={datePickerState.startDate}
                  onDateChange={handleStartDateChange}
                  placeholder="Selecciona fecha de inicio"
                  disabled={isScraping}
                />
                <p className="text-xs text-gray-500">
                  Fecha de inicio del rango de búsqueda
                </p>
              </div>

              {/* Fecha Final */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium">
                  Fecha Final
                </Label>
                <DatePicker
                  date={datePickerState.endDate}
                  onDateChange={handleEndDateChange}
                  placeholder="Selecciona fecha de fin"
                  disabled={isScraping}
                />
                <p className="text-xs text-gray-500">
                  Fecha de fin del rango de búsqueda
                </p>
              </div>

              {/* Botón de Scraping */}
              <Button 
                onClick={handleScraping}
                disabled={isScraping || !form.nit || !form.password || !form.startDate || !form.endDate}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-medium"
              >
                {isScraping ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Ejecutando Scraping F2X...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-3" />
                    Iniciar Scraping F2X
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resultados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resultados del Scraping
              </CardTitle>
              <CardDescription>
                Estado y resultados del proceso de descarga
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!scrapingResult ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Esperando ejecución
                  </h3>
                  <p className="text-gray-600">
                    Completa el formulario y ejecuta el scraping para ver los resultados
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Estado del resultado */}
                  <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                    scrapingResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    {scrapingResult.success ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <p className={`font-semibold ${
                        scrapingResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {scrapingResult.message}
                      </p>
                      {scrapingResult.error && (
                        <p className="text-sm text-red-600 mt-1">
                          Error: {scrapingResult.error}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detalles del resultado */}
                  {scrapingResult.success && scrapingResult.data && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">Detalles de la descarga:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">NIT:</span>
                          <p className="text-gray-900">{scrapingResult.data.nit}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Rango de fechas:</span>
                          <p className="text-gray-900">{scrapingResult.data.dateRange}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Hora de descarga:</span>
                          <p className="text-gray-900">{formatDate(scrapingResult.data.downloadTime)}</p>
                        </div>
                        {scrapingResult.data.downloadedFile && (
                          <div className="col-span-2">
                            <span className="font-medium text-gray-600">Archivo descargado:</span>
                            <p className="text-gray-900 break-all">{scrapingResult.data.downloadedFile}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Información del Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Autenticación Segura</h3>
                <p className="text-sm text-gray-600">
                  Las credenciales se envían de forma segura y no se almacenan en el servidor
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Filtros de Fecha</h3>
                <p className="text-sm text-gray-600">
                  Especifica el rango de fechas para descargar solo las facturas que necesitas
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Descarga Automática</h3>
                <p className="text-sm text-gray-600">
                  El sistema descarga automáticamente los archivos y los guarda localmente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
