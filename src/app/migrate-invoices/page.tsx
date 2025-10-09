"use client"

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowRightLeft, 
  FileText,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Eye
} from "lucide-react"

interface InvoiceMigration {
  id: string;
  documentNumber: string;
  date: string;
  totalValue: string;
  status: 'pending' | 'migrated' | 'failed';
  senderName: string;
  senderNit: string;
  type: string;
  migrationPath?: string;
  migrationDate?: string;
  downloadPath?: string;
}


export default function MigrateInvoicesPage() {
  const [migrations, setMigrations] = useState<InvoiceMigration[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const [showXMLModal, setShowXMLModal] = useState(false);
  const [isXMLModalAnimating, setIsXMLModalAnimating] = useState(false);
  const [xmlContent, setXmlContent] = useState<string>('');
  const [xmlFileName, setXmlFileName] = useState<string>('');
  const [supplierInfo, setSupplierInfo] = useState<{
    name: string;
    nit: string;
    address: string;
    city: string;
    nameFound: boolean;
    nitFound: boolean;
    addressFound: boolean;
    cityFound: boolean;
  } | null>(null);
  const [invoiceLines, setInvoiceLines] = useState<{
    id: string;
    description: string;
    quantity: string;
    unitPrice: string;
    totalAmount: string;
  }[]>([]);
  const [invoiceTotal, setInvoiceTotal] = useState<{ amount: string; found: boolean }>({ amount: '0', found: false });

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
        setMigrations(result.data.documents);
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

  const handleMigrateInvoices = async () => {
    setIsMigrating(true);
    
    setTimeout(() => {
      setIsMigrating(false);
      loadDocuments();
    }, 2000);
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'migrated':
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
      case 'migrated':
        return 'Migrado';
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
      case 'migrated':
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

  const handleMigrate = (invoice: InvoiceMigration) => {
    console.log('Migrating invoice:', invoice);
    // Aquí implementarías la lógica de migración
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
      setInvoiceTotal({ amount: '0', found: false });
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
          city: 'No encontrado',
          nameFound: false,
          nitFound: false,
          addressFound: false,
          cityFound: false
        };
      }
      
      // Buscar la sección PartyTaxScheme del proveedor
      const partyTaxScheme = supplierParty.querySelector('cac\\:Party cac\\:PartyTaxScheme, Party PartyTaxScheme');
      
      if (!partyTaxScheme) {
        return {
          name: 'No encontrado',
          nit: 'No encontrado',
          address: 'No encontrado',
          city: 'No encontrado',
          nameFound: false,
          nitFound: false,
          addressFound: false,
          cityFound: false
        };
      }
      
      // Extraer nombre del proveedor con lógica de fallback
      // Primero intentar desde RegistrationName en PartyTaxScheme
      let supplierNameElement = partyTaxScheme.querySelector('cbc\\:RegistrationName, RegistrationName');
      let supplierName = supplierNameElement?.textContent?.trim();
      let nameFound = !!supplierName;
      
      // Si no se encuentra, buscar en PartyName como fallback
      if (!supplierName) {
        supplierNameElement = supplierParty.querySelector('cac\\:Party cac\\:PartyName cbc\\:Name, Party PartyName Name');
        supplierName = supplierNameElement?.textContent?.trim();
        nameFound = !!supplierName;
      }
      
      supplierName = supplierName || 'No encontrado';
      
      // Extraer NIT del proveedor con lógica de fallback
      // Primero intentar desde CompanyID en PartyTaxScheme
      let supplierNitElement = partyTaxScheme.querySelector('cbc\\:CompanyID, CompanyID');
      let supplierNit = supplierNitElement?.textContent?.trim();
      let nitFound = !!supplierNit;
      
      // Si no se encuentra, buscar en PartyIdentification como fallback
      if (!supplierNit) {
        supplierNitElement = supplierParty.querySelector('cac\\:Party cac\\:PartyIdentification cbc\\:ID, Party PartyIdentification ID');
        supplierNit = supplierNitElement?.textContent?.trim();
        nitFound = !!supplierNit;
      }
      
      supplierNit = supplierNit || 'No encontrado';
      
      // Extraer dirección desde RegistrationAddress en PartyTaxScheme
      const addressElement = partyTaxScheme.querySelector('cac\\:RegistrationAddress cac\\:AddressLine cbc\\:Line, RegistrationAddress AddressLine Line');
      const address = addressElement?.textContent?.trim() || 'No encontrado';
      const addressFound = !!addressElement?.textContent?.trim();
      
      // Extraer ciudad desde RegistrationAddress en PartyTaxScheme
      const cityElement = partyTaxScheme.querySelector('cac\\:RegistrationAddress cbc\\:CityName, RegistrationAddress CityName');
      const city = cityElement?.textContent?.trim() || 'No encontrado';
      const cityFound = !!cityElement?.textContent?.trim();
      
      return {
        name: supplierName,
        nit: supplierNit,
        address: address,
        city: city,
        nameFound,
        nitFound,
        addressFound,
        cityFound
      };
    } catch (error) {
      console.error('Error extracting supplier info:', error);
      return {
        name: 'Error al extraer',
        nit: 'Error al extraer',
        address: 'Error al extraer',
        city: 'Error al extraer',
        nameFound: false,
        nitFound: false,
        addressFound: false,
        cityFound: false
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
        return { amount: '0', found: false };
      }
      
      // Extraer el PayableAmount (total a pagar)
      const payableAmountElement = legalMonetaryTotal.querySelector('cbc\\:PayableAmount, PayableAmount');
      const payableAmount = payableAmountElement?.textContent?.trim() || '0';
      const found = !!payableAmountElement?.textContent?.trim() && payableAmount !== '0';
      
      return { amount: payableAmount, found };
    } catch (error) {
      console.error('Error extracting invoice total:', error);
      return { amount: '0', found: false };
    }
  };

  const handleViewXML = async (downloadPath: string | undefined) => {
    if (!downloadPath) {
      console.error('No download path provided');
      return;
    }

    try {
      // Convertir ruta PDF a ruta XML (igual que en invoice-downloads)
      // Manejar diferentes formatos de rutas
      let xmlPath = downloadPath;
      
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
        const fileName = downloadPath.split('/').pop() || downloadPath.split('\\').pop();
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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Migrar Facturas
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Migra y previsualiza tus facturas desde SIIGO
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Migración de Facturas</CardTitle>
                    <CardDescription>
                      Migra facturas del sistema SIIGO automáticamente
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleMigrateInvoices}
                      disabled={isMigrating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isMigrating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Migrando masivamente...
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="h-4 w-4 mr-2" />
                          Migrar masivamente
                        </>
                      )}
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
                ) : migrations.length === 0 ? (
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
                      <h3 className="text-lg font-medium">Documentos Disponibles ({migrations.length})</h3>
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
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Ruta de Migración</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {migrations.map((invoice) => (
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
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                  {getStatusIcon(invoice.status)}
                                  {getStatusText(invoice.status)}
                                </div>
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-600">
                                {invoice.migrationPath ? (
                                  <div className="max-w-xs truncate" title={invoice.migrationPath}>
                                    {invoice.migrationPath}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">No migrado</span>
                                )}
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleViewXML(invoice.downloadPath)}
                                    title="Ver XML"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleMigrate(invoice)}
                                    title="Migrar factura"
                                  >
                                    <ArrowRightLeft className="h-3 w-3" />
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
                          <div className="flex items-center gap-1 flex-1">
                            {!supplierInfo.nameFound && <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0" />}
                            <span className={`text-sm font-semibold ${supplierInfo.nameFound ? 'text-gray-900' : 'text-red-600'}`}>
                              {supplierInfo.name}
                            </span>
                    </div>
                  </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-700 w-16">NIT:</span>
                          <div className="flex items-center gap-1">
                            {!supplierInfo.nitFound && <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0" />}
                            <span className={`text-sm ${supplierInfo.nitFound ? 'text-gray-900' : 'text-red-600'}`}>
                              {supplierInfo.nit}
                            </span>
                  </div>
                  </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-gray-700 w-16 mt-0.5">Dirección:</span>
                          <div className="flex items-start gap-1 flex-1">
                            {!supplierInfo.addressFound && <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />}
                            <span className={`text-sm ${supplierInfo.addressFound ? 'text-gray-900' : 'text-red-600'}`}>
                              {supplierInfo.address}
                            </span>
                </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-700 w-16">Ciudad:</span>
                          <div className="flex items-center gap-1">
                            {!supplierInfo.cityFound && <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0" />}
                            <span className={`text-sm ${supplierInfo.cityFound ? 'text-gray-900' : 'text-red-600'}`}>
                              {supplierInfo.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total de la Operación */}
                  {invoiceTotal && invoiceTotal.amount !== '0' && (
                    <div className="border rounded-lg overflow-hidden bg-orange-50">
                      <div className="bg-orange-100 px-3 py-2 border-b">
                        <h3 className="text-sm font-medium text-orange-800">Total de la Operación</h3>
                      </div>
                      <div className="p-4">
                        <div className="text-center">
                          <div className={`flex items-center justify-center gap-2 text-xl font-bold mb-1 ${invoiceTotal.found ? 'text-orange-900' : 'text-red-600'}`}>
                            {!invoiceTotal.found && <AlertTriangle className="h-5 w-5 text-red-600" />}
                            <span>
                              {invoiceTotal.found ? `$${parseFloat(invoiceTotal.amount).toLocaleString('es-CO')}` : 'No encontrado'}
                      </span>
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
                  </div>

                {/* Footer con botones */}
                <div className="border-t bg-gray-50 p-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Migrar el XML
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
                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                    Migrar
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


