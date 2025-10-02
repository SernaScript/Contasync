"use client"

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
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
  ChevronRight,
  Bot
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
  downloadPath?: string;
  downloadDate?: string;
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
  processedFiles?: ProcessedFile[];
  isProcessed?: boolean;
}

interface ProcessedFile {
  originalName: string;
  extractedName: string;
  fileType: 'xml' | 'pdf' | 'other';
  size: number;
  path: string;
  extractedDate: string;
}

export default function InvoiceDownloadsPage() {
  const [downloads, setDownloads] = useState<InvoiceDownload[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
<<<<<<< HEAD
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
=======
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
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [showScrapingModal, setShowScrapingModal] = useState(false);
  const [showXMLModal, setShowXMLModal] = useState(false);
  const [isXMLModalAnimating, setIsXMLModalAnimating] = useState(false);
  const [xmlContent, setXmlContent] = useState<string>('');
  const [xmlFileName, setXmlFileName] = useState<string>('');
  const [supplierInfo, setSupplierInfo] = useState<{
    name: string;
    nit: string;
    address: string;
    city: string;
  } | null>(null);
  const [invoiceLines, setInvoiceLines] = useState<{
    id: string;
    description: string;
    quantity: string;
    unitPrice: string;
    totalAmount: string;
  }[]>([]);
  const [invoiceTotal, setInvoiceTotal] = useState<string>('0');

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
        
        // Detectar si hay filtros activos
        const hasFilters = !!(searchFilters.documentNumber || searchFilters.senderName || searchFilters.senderNit);
        setHasActiveFilters(hasFilters);
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
    setHasActiveFilters(false);
    setPagination(prev => ({ ...prev, page: 1 }));
    loadDocuments(1, {
      documentNumber: '',
      senderName: '',
      senderNit: ''
    });
  };
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027

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
      const response = await fetch('/api/scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scrapingForm)
      });

      const result = await response.json();

      if (result.success) {
        setScrapingResult({
          success: true,
          message: result.message,
          downloadedFiles: result.data.downloadedFiles
        });
        
        // Convert scraping results to invoice downloads format
        const convertedDownloads: InvoiceDownload[] = result.data.downloadedFiles.map((file: DownloadedFile, index: number) => ({
          id: (index + 1).toString(),
<<<<<<< HEAD
          invoiceNumber: file.filename.replace('.pdf', '').replace('.xml', '').replace('.zip', '').replace('.rar', ''),
          date: new Date(file.downloadDate).toISOString().split('T')[0],
          amount: 0, // Amount not available from scraping
          status: file.isProcessed ? 'downloaded' : 'pending' as const,
          customer: 'DIAN',
=======
          documentNumber: file.filename.replace('.pdf', '').replace('.xml', ''),
          date: new Date(file.downloadDate).toISOString().split('T')[0],
          totalValue: 'N/A', // Amount not available from scraping
          status: 'downloaded' as const,
          senderName: 'DIAN',
          senderNit: 'N/A',
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027
          type: 'Documento'
        }));
        
        // Collect all processed files
        const allProcessedFiles: ProcessedFile[] = [];
        result.data.downloadedFiles.forEach((file: DownloadedFile) => {
          if (file.processedFiles) {
            allProcessedFiles.push(...file.processedFiles);
          }
        });
        
        setDownloads(convertedDownloads);
<<<<<<< HEAD
        setProcessedFiles(allProcessedFiles);
=======
        loadDocuments();
        setShowScrapingModal(false); // Cerrar modal después del éxito
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027
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

  const handleOpenScrapingModal = () => {
    setShowScrapingModal(true);
    setScrapingResult(null);
  };

  const handleDownloadFile = async (filePath: string | undefined) => {
    if (!filePath) {
      console.error('No file path provided');
      return;
    }

    try {
      
      const downloadUrl = `/api/download-file?path=${encodeURIComponent(filePath)}`;
      
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filePath.split('/').pop() || 'documento.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      
    }
  };

  const openXMLModal = () => {
    setShowXMLModal(true);

    setTimeout(() => {
      setIsXMLModalAnimating(true);
    }, 100);
  };

  const closeXMLModal = () => {
    setIsXMLModalAnimating(false);
    setTimeout(() => {
      setShowXMLModal(false);
      setInvoiceLines([]);
      setInvoiceTotal('0');
    }, 500);
  };

  const extractSupplierInfo = (xmlText: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Buscar la sección del proveedor (AccountingSupplierParty)
      const supplierParty = xmlDoc.querySelector('cac\\:AccountingSupplierParty, AccountingSupplierParty');
      
      if (!supplierParty) {
        return {
          name: 'No encontrado',
          nit: 'No encontrado',
          address: 'No encontrado',
          city: 'No encontrado'
        };
      }
      
      // Buscar la sección PartyTaxScheme del proveedor
      const partyTaxScheme = supplierParty.querySelector('cac\\:Party cac\\:PartyTaxScheme, Party PartyTaxScheme');
      
      if (!partyTaxScheme) {
        return {
          name: 'No encontrado',
          nit: 'No encontrado',
          address: 'No encontrado',
          city: 'No encontrado'
        };
      }
      
      // Extraer nombre del proveedor con lógica de fallback
      // Primero intentar desde RegistrationName en PartyTaxScheme
      let supplierNameElement = partyTaxScheme.querySelector('cbc\\:RegistrationName, RegistrationName');
      let supplierName = supplierNameElement?.textContent?.trim();
      
      // Si no se encuentra, buscar en PartyName como fallback
      if (!supplierName) {
        supplierNameElement = supplierParty.querySelector('cac\\:Party cac\\:PartyName cbc\\:Name, Party PartyName Name');
        supplierName = supplierNameElement?.textContent?.trim();
      }
      
      supplierName = supplierName || 'No encontrado';
      
      // Extraer NIT del proveedor con lógica de fallback
      // Primero intentar desde CompanyID en PartyTaxScheme
      let supplierNitElement = partyTaxScheme.querySelector('cbc\\:CompanyID, CompanyID');
      let supplierNit = supplierNitElement?.textContent?.trim();
      
      // Si no se encuentra, buscar en PartyIdentification como fallback
      if (!supplierNit) {
        supplierNitElement = supplierParty.querySelector('cac\\:Party cac\\:PartyIdentification cbc\\:ID, Party PartyIdentification ID');
        supplierNit = supplierNitElement?.textContent?.trim();
      }
      
      supplierNit = supplierNit || 'No encontrado';
      
      // Extraer dirección desde RegistrationAddress en PartyTaxScheme
      const addressElement = partyTaxScheme.querySelector('cac\\:RegistrationAddress cac\\:AddressLine cbc\\:Line, RegistrationAddress AddressLine Line');
      const address = addressElement?.textContent?.trim() || 'No encontrado';
      
      // Extraer ciudad desde RegistrationAddress en PartyTaxScheme
      const cityElement = partyTaxScheme.querySelector('cac\\:RegistrationAddress cbc\\:CityName, RegistrationAddress CityName');
      const city = cityElement?.textContent?.trim() || 'No encontrado';
      
      return {
        name: supplierName,
        nit: supplierNit,
        address: address,
        city: city
      };
    } catch (error) {
      console.error('Error extracting supplier info:', error);
      return {
        name: 'Error al extraer',
        nit: 'Error al extraer',
        address: 'Error al extraer',
        city: 'Error al extraer'
      };
    }
  };

  const extractInvoiceLines = (xmlText: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Buscar todas las líneas de factura (InvoiceLine)
      const invoiceLineElements = xmlDoc.querySelectorAll('cac\\:InvoiceLine, InvoiceLine');
      
      if (!invoiceLineElements || invoiceLineElements.length === 0) {
        return [];
      }
      
      const lines = Array.from(invoiceLineElements).map((line, index) => {
        // Extraer ID de la línea
        const idElement = line.querySelector('cbc\\:ID, ID');
        const id = idElement?.textContent?.trim() || `${index + 1}`;
        
        // Extraer descripción del item
        const descriptionElement = line.querySelector('cac\\:Item cbc\\:Description, Item Description');
        const description = descriptionElement?.textContent?.trim() || 'No disponible';
        
        // Extraer cantidad
        const quantityElement = line.querySelector('cbc\\:InvoicedQuantity, InvoicedQuantity');
        const quantity = quantityElement?.textContent?.trim() || '0';
        
        // Extraer precio unitario
        const priceElement = line.querySelector('cac\\:Price cbc\\:PriceAmount, Price PriceAmount');
        const unitPrice = priceElement?.textContent?.trim() || '0';
        
        // Extraer monto total de la línea
        const totalElement = line.querySelector('cbc\\:LineExtensionAmount, LineExtensionAmount');
        const totalAmount = totalElement?.textContent?.trim() || '0';
        
        return {
          id,
          description,
          quantity,
          unitPrice,
          totalAmount
        };
      });
      
      return lines;
    } catch (error) {
      console.error('Error extracting invoice lines:', error);
      return [];
    }
  };

  const extractInvoiceTotal = (xmlText: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Buscar la sección LegalMonetaryTotal
      const legalMonetaryTotal = xmlDoc.querySelector('cac\\:LegalMonetaryTotal, LegalMonetaryTotal');
      
      if (!legalMonetaryTotal) {
        return '0';
      }
      
      // Extraer el PayableAmount (total a pagar)
      const payableAmountElement = legalMonetaryTotal.querySelector('cbc\\:PayableAmount, PayableAmount');
      const payableAmount = payableAmountElement?.textContent?.trim() || '0';
      
      return payableAmount;
    } catch (error) {
      console.error('Error extracting invoice total:', error);
      return '0';
    }
  };

  const handleViewXML = async (pdfPath: string | undefined) => {
    if (!pdfPath) {
      console.error('No PDF path provided');
      return;
    }

    try {
      // Convertir ruta PDF a ruta XML
      // Manejar diferentes formatos de rutas
      let xmlPath = pdfPath;
      
      // Reemplazar /PDF/ por /XML/ y cambiar .pdf por .xml
      if (xmlPath.includes('/PDF/')) {
        xmlPath = xmlPath.replace('/PDF/', '/XML/');
      } else if (xmlPath.includes('\\PDF\\')) {
        xmlPath = xmlPath.replace('\\PDF\\', '\\XML\\');
      }
      
      if (xmlPath.endsWith('.pdf')) {
        xmlPath = xmlPath.replace('.pdf', '.xml');
      }
      
      // Crear URL para obtener el contenido del XML
      const xmlUrl = `/api/download-file?path=${encodeURIComponent(xmlPath)}`;
      
      // Obtener el contenido del XML
      let response = await fetch(xmlUrl);
      
      if (!response.ok) {
        console.error('First attempt failed - Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        
        // Intentar con una ruta alternativa basada en el nombre del archivo
        const fileName = pdfPath.split('/').pop() || pdfPath.split('\\').pop();
        if (fileName) {
          const alternativeXmlPath = `downloads/scraping-results/XML/${fileName.replace('.pdf', '.xml')}`;
          
          const alternativeUrl = `/api/download-file?path=${encodeURIComponent(alternativeXmlPath)}`;
          response = await fetch(alternativeUrl);
          
          if (response.ok) {
            // Actualizar xmlPath para el resto de la función
            xmlPath = alternativeXmlPath;
          }
        }
        
        if (!response.ok) {
          throw new Error(`Error loading XML: ${response.statusText}`);
        }
      }
      
      const xmlText = await response.text();
      
      // Extraer información del proveedor
      const supplierData = extractSupplierInfo(xmlText);
      
      // Extraer líneas de factura
      const invoiceLinesData = extractInvoiceLines(xmlText);
      
      // Extraer total de la operación
      const invoiceTotalData = extractInvoiceTotal(xmlText);
      
      // Configurar el estado del modal
      setXmlContent(xmlText);
      setXmlFileName(xmlPath.split('/').pop() || 'documento.xml');
      setSupplierInfo(supplierData);
      setInvoiceLines(invoiceLinesData);
      setInvoiceTotal(invoiceTotalData);
      openXMLModal();
    } catch (error) {
      console.error('Error loading XML:', error);
      // Aquí podrías agregar una notificación de error al usuario
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
    if (!dateString) return 'N/A';
    
    let date: Date;
    
    if (dateString.includes('-') && dateString.split('-')[0].length <= 2) {
      const [day, month, year] = dateString.split('-');
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      date = new Date(isoDate);
    } else {
      date = new Date(dateString);
    }

    // Formato dd/mm/aa
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    return `${day}/${month}/${year}`;
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

<<<<<<< HEAD
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
            <TabsTrigger value="processed" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Archivos Procesados
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visualización de Facturas
            </TabsTrigger>
          </TabsList>

          {/* Download Tab */}
          <TabsContent value="download" className="space-y-4">
=======
        {/* Main Content */}
        <div className="space-y-4">
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Descarga de Facturas</CardTitle>
                    <CardDescription>
                      Descarga facturas del sistema SIIGO automáticamente
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
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
                    <Button 
                      onClick={handleOpenScrapingModal}
                      disabled={isScraping}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Migrar información DIAN
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/services/f2x-automation'}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Automatización F2X
                    </Button>
                  </div>
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
                      {hasActiveFilters ? 'No encontramos documentos con los valores seleccionados' : 'No hay documentos disponibles'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {hasActiveFilters ? 'Intenta con otros filtros o limpia la búsqueda' : 'Ejecuta el scraping para obtener documentos de la DIAN'}
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={handleClearFilters} className="bg-blue-600 hover:bg-blue-700">
                        Limpiar Filtros
                      </Button>
                    )}
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
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Fecha</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">NIT</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Proveedor</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Nº Documento</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Valor Total</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Estado</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {downloads.map((invoice) => (
                            <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 text-sm text-gray-600 font-medium">
                                {formatDate(invoice.date)}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-600">
                                {invoice.senderNit}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-700">
                                {invoice.senderName}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-900 font-medium">
                                {invoice.documentNumber}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium text-gray-900">
                                {invoice.totalValue}
                              </td>
                              <td className="py-2 px-3">
                                {getStatusIcon(invoice.status)}
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 w-7 p-0"
                                    disabled={!invoice.downloadPath}
                                    title={invoice.downloadPath ? "Descargar PDF" : "Archivo no disponible"}
                                    onClick={() => handleDownloadFile(invoice.downloadPath)}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 w-7 p-0"
                                    disabled={!invoice.downloadPath}
                                    title={invoice.downloadPath ? "Ver XML" : "Archivo no disponible"}
                                    onClick={() => handleViewXML(invoice.downloadPath)}
                                  >
                                    <FileText className="h-3 w-3" />
                                  </Button>
                                </div>
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
        </div>

        {/* Modal de Configuración de Scraping */}
        {showScrapingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-lg p-8 w-full max-w-[95vw] h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Migrar información DIAN
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScrapingModal(false)}
                  className="h-10 w-10 p-0 text-lg font-bold hover:bg-gray-100"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-8">
                <p className="text-lg text-gray-600">
                  Configura los parámetros para descargar documentos desde la DIAN automáticamente
                </p>
                
                {/* Three column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Column 1: Date Range */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="text-base font-medium">Fecha de Inicio</Label>
                      <DatePicker
                        date={datePickerState.startDate}
                        onDateChange={handleStartDateChange}
                        placeholder="Selecciona fecha de inicio"
                        disabled={isScraping}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="endDate" className="text-base font-medium">Fecha de Fin</Label>
                      <DatePicker
                        date={datePickerState.endDate}
                        onDateChange={handleEndDateChange}
                        placeholder="Selecciona fecha de fin"
                        disabled={isScraping}
                      />
                    </div>
                  </div>
                  
                  {/* Column 2: URL */}
                  <div className="space-y-3">
                    <Label htmlFor="token" className="text-base font-medium">URL de Autenticación DIAN</Label>
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
                      className="h-12 text-sm"
                    />
                    <p className="text-sm text-gray-500">
                      Ingresa la URL completa de autenticación de la DIAN
                    </p>
                  </div>
                  
                  {/* Column 3: Action Button */}
                  <div className="flex items-end">
                    <Button 
                      onClick={handleScraping}
                      disabled={isScraping || !scrapingForm.token || !scrapingForm.startDate || !scrapingForm.endDate}
                      className="w-full h-14 bg-green-600 hover:bg-green-700 text-base font-medium"
                    >
                      {isScraping ? (
                        <>
                          <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                          Ejecutando Scraping...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5 mr-3" />
                          Ejecutar Scraping
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Scraping Result */}
                {scrapingResult && (
                  <div className="mt-6 p-6 rounded-lg border-2">
                    <div className={`flex items-center gap-3 mb-4 ${
                      scrapingResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {scrapingResult.success ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <AlertCircle className="h-6 w-6" />
                      )}
                      <span className="font-semibold text-base">
                        {scrapingResult.message}
                      </span>
                    </div>
                    
                    {scrapingResult.downloadedFiles && scrapingResult.downloadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-base font-semibold text-gray-700 mb-3">
                          Archivos descargados ({scrapingResult.downloadedFiles.length}):
                        </h4>
                        <div className="space-y-2">
                          {scrapingResult.downloadedFiles.map((file, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-3 p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4" />
                              {file.filename} ({(file.size / 1024).toFixed(1)} KB)
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Panel Lateral de Visualización de XML */}
        {showXMLModal && (
            <div className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 transform transition-all duration-500 ease-in-out ${
              isXMLModalAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
              <div className="flex flex-col h-full">
                {/* Header del panel */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Visualizador de XML
                      </h2>
                      <p className="text-sm text-gray-500">{xmlFileName}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={closeXMLModal}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    ×
                  </Button>
                </div>

                {/* Contenido del panel */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Información del Proveedor */}
                  {supplierInfo && (
                    <div className="border rounded-lg overflow-hidden bg-blue-50">
                      <div className="bg-blue-100 px-3 py-2 border-b">
                        <h3 className="text-sm font-medium text-blue-800">Información del Proveedor</h3>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-gray-700 w-16 mt-0.5">Nombre:</span>
                          <span className="text-sm text-gray-900 font-semibold flex-1">{supplierInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-700 w-16">NIT:</span>
                          <span className="text-sm text-gray-900">{supplierInfo.nit}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-gray-700 w-16 mt-0.5">Dirección:</span>
                          <span className="text-sm text-gray-900 flex-1">{supplierInfo.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-700 w-16">Ciudad:</span>
                          <span className="text-sm text-gray-900">{supplierInfo.city}</span>
                        </div>
                      </div>
                    </div>
                  )}

<<<<<<< HEAD
          {/* Processed Files Tab */}
          <TabsContent value="processed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Archivos Procesados</CardTitle>
                <CardDescription>
                  Archivos extraídos y clasificados por tipo (XML, PDF, otros)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay archivos procesados
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Los archivos procesados aparecerán aquí después de ejecutar el scraping
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Archivos XML</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900 mt-1">
                          {processedFiles.filter(f => f.fileType === 'xml').length}
                        </p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-red-600" />
                          <span className="text-sm font-medium text-red-900">Archivos PDF</span>
                        </div>
                        <p className="text-2xl font-bold text-red-900 mt-1">
                          {processedFiles.filter(f => f.fileType === 'pdf').length}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Otros Archivos</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {processedFiles.filter(f => f.fileType === 'other').length}
                        </p>
                      </div>
                    </div>

                    {/* File List */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Lista de Archivos Procesados</h3>
                      <div className="space-y-2">
                        {processedFiles.map((file, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  file.fileType === 'xml' ? 'bg-blue-100' :
                                  file.fileType === 'pdf' ? 'bg-red-100' : 'bg-gray-100'
                                }`}>
                                  <FileText className={`h-5 w-5 ${
                                    file.fileType === 'xml' ? 'text-blue-600' :
                                    file.fileType === 'pdf' ? 'text-red-600' : 'text-gray-600'
                                  }`} />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {file.extractedName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Extraído de: {file.originalName}
                                  </p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      file.fileType === 'xml' ? 'bg-blue-100 text-blue-800' :
                                      file.fileType === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {file.fileType.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(file.extractedDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver
                                </Button>
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
                  </div>
                )}
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
=======
                  {/* Total de la Operación */}
                  {invoiceTotal && invoiceTotal !== '0' && (
                    <div className="border rounded-lg overflow-hidden bg-orange-50">
                      <div className="bg-orange-100 px-3 py-2 border-b">
                        <h3 className="text-sm font-medium text-orange-800">Total de la Operación</h3>
                      </div>
                      <div className="p-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-orange-900 mb-1">
                            ${parseFloat(invoiceTotal).toLocaleString('es-CO')}
                          </div>
                          <div className="text-xs text-orange-700 font-medium">
                            Total a Pagar (COP)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Líneas de Factura */}
                  {invoiceLines && invoiceLines.length > 0 && (
                    <div className="border rounded-lg overflow-hidden bg-green-50">
                      <div className="bg-green-100 px-3 py-2 border-b">
                        <h3 className="text-sm font-medium text-green-800">Líneas de Factura ({invoiceLines.length} items)</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full bg-white text-xs">
                          <thead className="bg-green-50">
                            <tr>
                              <th className="px-2 py-2 text-left text-xs font-medium text-green-800 uppercase">
                                #
                              </th>
                              <th className="px-2 py-2 text-left text-xs font-medium text-green-800 uppercase">
                                Descripción
                              </th>
                              <th className="px-2 py-2 text-right text-xs font-medium text-green-800 uppercase">
                                Cant.
                              </th>
                              <th className="px-2 py-2 text-right text-xs font-medium text-green-800 uppercase">
                                P. Unit.
                              </th>
                              <th className="px-2 py-2 text-right text-xs font-medium text-green-800 uppercase">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {invoiceLines.map((line, index) => (
                              <tr key={line.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-2 py-2 whitespace-nowrap">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {line.id}
                                  </span>
                                </td>
                                <td className="px-2 py-2">
                                  <div className="text-xs font-medium text-gray-900 max-w-[160px] break-words">
                                    {line.description}
                                  </div>
                                </td>
                                <td className="px-2 py-2 text-right whitespace-nowrap">
                                  <span className="text-xs text-gray-900">
                                    {parseFloat(line.quantity || '0').toLocaleString('es-CO')}
                                  </span>
                                </td>
                                <td className="px-2 py-2 text-right whitespace-nowrap">
                                  <span className="text-xs text-gray-900">
                                    ${parseFloat(line.unitPrice || '0').toLocaleString('es-CO')}
                                  </span>
                                </td>
                                <td className="px-2 py-2 text-right whitespace-nowrap">
                                  <span className="text-xs font-semibold text-gray-900">
                                    ${parseFloat(line.totalAmount || '0').toLocaleString('es-CO')}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-green-50">
                            <tr>
                              <td colSpan={4} className="px-2 py-2 text-right text-xs font-medium text-green-800">
                                Total:
                              </td>
                              <td className="px-2 py-2 text-right whitespace-nowrap">
                                <span className="text-xs font-bold text-green-900">
                                  ${invoiceLines.reduce((sum, line) => sum + parseFloat(line.totalAmount || '0'), 0).toLocaleString('es-CO')}
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Contenido XML colapsable */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b">
                      <h3 className="text-sm font-medium text-gray-700">Contenido XML</h3>
                    </div>
                    <div className="p-3 bg-gray-900 text-green-400 font-mono text-xs overflow-auto max-h-60">
                      <pre className="whitespace-pre-wrap break-words">
                        {xmlContent}
                      </pre>
                    </div>
                  </div>
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027
                </div>

                {/* Footer con botones */}
                <div className="border-t bg-gray-50 p-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Función para formatear el XML
                      try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
                        const serializer = new XMLSerializer();
                        const formattedXML = serializer.serializeToString(xmlDoc);
                        setXmlContent(formattedXML);
                      } catch (error) {
                        console.error('Error formatting XML:', error);
                      }
                    }}
                  >
                    Formatear
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Descargar el XML
                      const blob = new Blob([xmlContent], { type: 'application/xml' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = xmlFileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    onClick={closeXMLModal}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
        )}
      </div>
    </MainLayout>
  )
}
