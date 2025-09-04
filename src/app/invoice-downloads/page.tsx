"use client"

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Download, 
  Eye,
  FileText,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Key,
  Settings
} from "lucide-react"

interface InvoiceDownload {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'pending' | 'downloaded' | 'failed';
  customer: string;
  type: string;
}

interface ScrapingForm {
  token: string; // This will contain the full URL
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
  downloadedFiles?: DownloadedFile[];
  error?: string;
}

interface DownloadedFile {
  filename: string;
  size: number;
  downloadPath: string;
  downloadDate: string;
}

export default function InvoiceDownloadsPage() {
  const [downloads, setDownloads] = useState<InvoiceDownload[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("download");
  const [scrapingForm, setScrapingForm] = useState<ScrapingForm>({
    token: '',
    startDate: '',
    endDate: ''
  });
  const [datePickerState, setDatePickerState] = useState<DatePickerState>({
    startDate: undefined,
    endDate: undefined
  });
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null);
  const [isScraping, setIsScraping] = useState(false);

  const handleDownloadInvoices = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      // Add some mock data
      const mockDownloads: InvoiceDownload[] = [
        {
          id: '1',
          invoiceNumber: 'FAC-001-2024',
          date: '2024-01-15',
          amount: 1500000,
          status: 'downloaded',
          customer: 'Empresa ABC S.A.S.',
          type: 'Venta'
        },
        {
          id: '2',
          invoiceNumber: 'FAC-002-2024',
          date: '2024-01-16',
          amount: 2300000,
          status: 'downloaded',
          customer: 'Comercial XYZ Ltda.',
          type: 'Venta'
        }
      ];
      setDownloads(mockDownloads);
    }, 2000);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setDatePickerState(prev => ({ ...prev, startDate: date }));
    if (date) {
      setScrapingForm(prev => ({
        ...prev,
        startDate: date.toISOString().split('T')[0]
      }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setDatePickerState(prev => ({ ...prev, endDate: date }));
    if (date) {
      setScrapingForm(prev => ({
        ...prev,
        endDate: date.toISOString().split('T')[0]
      }));
    }
  };

  const handleScraping = async () => {
    if (!scrapingForm.token || !scrapingForm.startDate || !scrapingForm.endDate) {
      setScrapingResult({
        success: false,
        message: 'Por favor, completa todos los campos requeridos'
      });
      return;
    }

    setIsScraping(true);
    setScrapingResult(null);

    try {
      console.log('Sending scraping request:', {
        token: scrapingForm.token ? `${scrapingForm.token.substring(0, 10)}...` : 'missing',
        startDate: scrapingForm.startDate,
        endDate: scrapingForm.endDate
      });

      const response = await fetch('/api/scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scrapingForm)
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (result.success) {
        setScrapingResult({
          success: true,
          message: result.message,
          downloadedFiles: result.data.downloadedFiles
        });
        
        // Convert scraping results to invoice downloads format
        const convertedDownloads: InvoiceDownload[] = result.data.downloadedFiles.map((file: DownloadedFile, index: number) => ({
          id: (index + 1).toString(),
          invoiceNumber: file.filename.replace('.pdf', '').replace('.xml', ''),
          date: new Date(file.downloadDate).toISOString().split('T')[0],
          amount: 0, // Amount not available from scraping
          status: 'downloaded' as const,
          customer: 'DIAN',
          type: 'Documento'
        }));
        
        setDownloads(convertedDownloads);
      } else {
        // Use the Spanish message if available, otherwise fall back to error
        const errorMessage = result.message || result.error || 'Error desconocido';
        setScrapingResult({
          success: false,
          message: errorMessage,
          error: result.error
        });
      }
    } catch (error) {
      setScrapingResult({
        success: false,
        message: 'Error de conexión durante el scraping',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsScraping(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'downloaded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'Descargado';
      case 'failed':
        return 'Error';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Download className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Descarga de Facturas
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Descarga y gestiona tus facturas desde SIIGO
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Descarga de Facturas
            </TabsTrigger>
            <TabsTrigger value="scraping" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración de Scraping
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visualización de Facturas
            </TabsTrigger>
          </TabsList>

          {/* Download Tab */}
          <TabsContent value="download" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Descarga de Facturas</CardTitle>
                    <CardDescription>
                      Descarga facturas del sistema SIIGO automáticamente
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleDownloadInvoices}
                    disabled={isDownloading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Facturas
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {downloads.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aún no se han descargado facturas
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Haz clic en "Descargar Facturas" para comenzar a descargar facturas desde SIIGO
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Facturas Descargadas</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filtrar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Buscar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      {downloads.map((invoice) => (
                        <Card key={invoice.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {invoice.invoiceNumber}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {invoice.customer}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm text-gray-500">
                                    {formatDate(invoice.date)}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatCurrency(invoice.amount)}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {invoice.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                {getStatusIcon(invoice.status)}
                                {getStatusText(invoice.status)}
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scraping Configuration Tab */}
          <TabsContent value="scraping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Scraping DIAN</CardTitle>
                <CardDescription>
                  Configura los parámetros para descargar documentos desde la DIAN automáticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Three column layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Date Range */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Fecha de Inicio</Label>
                        <DatePicker
                          date={datePickerState.startDate}
                          onDateChange={handleStartDateChange}
                          placeholder="Selecciona fecha de inicio"
                          disabled={isScraping}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endDate">Fecha de Fin</Label>
                        <DatePicker
                          date={datePickerState.endDate}
                          onDateChange={handleEndDateChange}
                          placeholder="Selecciona fecha de fin"
                          disabled={isScraping}
                        />
                      </div>
                    </div>
                    
                    {/* Column 2: URL */}
                    <div className="space-y-2">
                      <Label htmlFor="token">URL de Autenticación DIAN</Label>
                      <Input
                        id="token"
                        type="text"
                        value={scrapingForm.token}
                        onChange={(e) => setScrapingForm(prev => ({
                          ...prev,
                          token: e.target.value
                        }))}
                        placeholder="https://catalogo-vpfe.dian.gov.co/User/AuthToken?pk=10910094%7C70322015&rk=900698993&token=82dadb26-4c96-4da7-9967-ec4a219c40c5"
                        disabled={isScraping}
                        className="h-10"
                      />
                      <p className="text-xs text-gray-500">
                        Ingresa la URL completa de autenticación de la DIAN
                      </p>
                    </div>
                    
                    {/* Column 3: Action Button */}
                    <div className="flex items-end">
                      <Button 
                        onClick={handleScraping}
                        disabled={isScraping || !scrapingForm.token || !scrapingForm.startDate || !scrapingForm.endDate}
                        className="w-full h-10 bg-green-600 hover:bg-green-700"
                      >
                        {isScraping ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Ejecutando Scraping...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Ejecutar Scraping
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Scraping Result */}
                  {scrapingResult && (
                    <div className="mt-4 p-4 rounded-lg border">
                      <div className={`flex items-center gap-2 mb-2 ${
                        scrapingResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {scrapingResult.success ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">
                          {scrapingResult.message}
                        </span>
                      </div>
                      
                      {scrapingResult.downloadedFiles && scrapingResult.downloadedFiles.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Archivos descargados ({scrapingResult.downloadedFiles.length}):
                          </h4>
                          <div className="space-y-1">
                            {scrapingResult.downloadedFiles.map((file, index) => (
                              <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                {file.filename} ({(file.size / 1024).toFixed(1)} KB)
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visualization Tab */}
          <TabsContent value="visualization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visualización de Facturas</CardTitle>
                <CardDescription>
                  Visualiza y analiza tus facturas descargadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Módulo de Visualización Próximamente
                  </h3>
                  <p className="text-gray-600">
                    Esta sección contendrá funcionalidades de visualización y análisis de facturas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
