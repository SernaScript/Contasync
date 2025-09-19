"use client"

import React, { useState, useEffect } from 'react';
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
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface InvoiceDownload {
  id: string;
  documentNumber: string;
  date: string;
  totalValue: string;
  status: 'pending' | 'downloaded' | 'failed';
  senderName: string;
  senderNit: string;
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
  const [isLoading, setIsLoading] = useState(true);
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    documentNumber: '',
    senderName: '',
    senderNit: ''
  });

  const loadDocuments = async (page: number = pagination.page, searchFilters = filters) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (searchFilters.documentNumber) {
        params.append('documentNumber', searchFilters.documentNumber);
      }
      if (searchFilters.senderName) {
        params.append('senderName', searchFilters.senderName);
      }
      if (searchFilters.senderNit) {
        params.append('senderNit', searchFilters.senderNit);
      }
      
      const response = await fetch(`/api/scraped-documents?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setDownloads(result.data.documents);
        setPagination(result.data.pagination);
      } else {
        console.error('Error loading documents:', result.message);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadDocuments(newPage);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      handlePageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      handlePageChange(pagination.page + 1);
    }
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadDocuments(1, filters);
  };

  const handleClearFilters = () => {
    setFilters({
      documentNumber: '',
      senderName: '',
      senderNit: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    loadDocuments(1, {
      documentNumber: '',
      senderName: '',
      senderNit: ''
    });
  };

  const handleDownloadInvoices = async () => {
    setIsDownloading(true);
    
    setTimeout(() => {
      setIsDownloading(false);
      loadDocuments();
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
          documentNumber: file.filename.replace('.pdf', '').replace('.xml', ''),
          date: new Date(file.downloadDate).toISOString().split('T')[0],
          totalValue: 'N/A', // Amount not available from scraping
          status: 'downloaded' as const,
          senderName: 'DIAN',
          senderNit: 'N/A',
          type: 'Documento'
        }));
        
        setDownloads(convertedDownloads);
        loadDocuments();
      } else {
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
                {isLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Cargando documentos...
                    </h3>
                    <p className="text-gray-600">
                      Obteniendo documentos de la base de datos
                    </p>
                  </div>
                ) : downloads.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay documentos disponibles
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ejecuta el scraping para obtener documentos de la DIAN
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Documentos Disponibles ({downloads.length})</h3>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowFilters(!showFilters)}
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          {showFilters ? 'Ocultar Filtros' : 'Filtrar'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => loadDocuments()}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Actualizar
                        </Button>
                      </div>
                    </div>
                    
                    {showFilters && (
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="filter-document-number" className="text-sm font-medium">
                              Nº Documento
                            </Label>
                            <Input
                              id="filter-document-number"
                              value={filters.documentNumber}
                              onChange={(e) => handleFilterChange('documentNumber', e.target.value)}
                              placeholder="Buscar por número de documento"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="filter-sender-name" className="text-sm font-medium">
                              Proveedor
                            </Label>
                            <Input
                              id="filter-sender-name"
                              value={filters.senderName}
                              onChange={(e) => handleFilterChange('senderName', e.target.value)}
                              placeholder="Buscar por nombre del proveedor"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="filter-sender-nit" className="text-sm font-medium">
                              NIT
                            </Label>
                            <Input
                              id="filter-sender-nit"
                              value={filters.senderNit}
                              onChange={(e) => handleFilterChange('senderNit', e.target.value)}
                              placeholder="Buscar por NIT"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                            <Search className="h-4 w-4 mr-2" />
                            Buscar
                          </Button>
                          <Button variant="outline" onClick={handleClearFilters}>
                            Limpiar Filtros
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Nº Documento</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Proveedor</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">NIT</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Fecha</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Valor Total</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Estado</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {downloads.map((invoice) => (
                            <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 text-sm text-gray-900 font-medium">
                                {invoice.documentNumber}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-700">
                                {invoice.senderName}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-600">
                                {invoice.senderNit}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-600">
                                {formatDate(invoice.date)}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium text-gray-900">
                                {invoice.totalValue}
                              </td>
                              <td className="py-2 px-3">
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                  {getStatusIcon(invoice.status)}
                                  {getStatusText(invoice.status)}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4 px-4 py-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center text-sm text-gray-700">
                          <span>
                            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} documentos
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={pagination.page <= 1}
                            className="flex items-center gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Anterior
                          </Button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                              const pageNum = i + 1;
                              const isActive = pageNum === pagination.page;
                              
                              return (
                                <Button
                                  key={pageNum}
                                  variant={isActive ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handlePageChange(pageNum)}
                                  className="w-8 h-8 p-0"
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                            
                            {pagination.totalPages > 5 && (
                              <>
                                <span className="text-gray-500">...</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePageChange(pagination.totalPages)}
                                  className="w-8 h-8 p-0"
                                >
                                  {pagination.totalPages}
                                </Button>
                              </>
                            )}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={pagination.page >= pagination.totalPages}
                            className="flex items-center gap-1"
                          >
                            Siguiente
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
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
