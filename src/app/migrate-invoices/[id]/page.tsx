"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { 
  ArrowRightLeft, 
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Save,
  AlertTriangle,
  RefreshCw
} from "lucide-react"
import { PDFViewerWrapper } from "@/components/PDFViewerWrapper"

interface SupplierInfo {
  name: string;
  nit: string;
  address: string;
  city: string;
  nameFound: boolean;
  nitFound: boolean;
  addressFound: boolean;
  cityFound: boolean;
}

interface ProductLine {
  id: string;
  productCode: string;
  description: string;
  warehouse: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  taxRate: string;
  retentionTax: string;
  totalAmount: string;
}

interface InvoiceData {
  supplierInfo: SupplierInfo;
  invoiceLines: ProductLine[];
  invoiceTotal: { amount: string; found: boolean };
  documentNumber: string;
  date: string;
  xmlContent: string;
  xmlFileName: string;
}

export default function MigrateInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadInvoiceData(params.id as string);
    }
  }, [params.id]);


  const loadInvoiceData = async (documentId: string) => {
    try {
      setIsLoading(true);
      
      // Obtener datos del documento desde la API
      const response = await fetch(`/api/scraped-documents/${documentId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const document = result.data;
        
        // Convertir ruta PDF a ruta XML
        let xmlPath = document.downloadPath;
        if (xmlPath.includes('/PDF/')) {
          xmlPath = xmlPath.replace('/PDF/', '/XML/');
        } else if (xmlPath.includes('\\PDF\\')) {
          xmlPath = xmlPath.replace('\\PDF\\', '\\XML\\');
        }
        
        if (xmlPath.endsWith('.pdf')) {
          xmlPath = xmlPath.replace('.pdf', '.xml');
        }
        
        // Obtener contenido del XML
        const xmlUrl = `/api/download-file?path=${encodeURIComponent(xmlPath)}`;
        let xmlResponse = await fetch(xmlUrl);
        
        if (!xmlResponse.ok) {
          // Intentar ruta alternativa
          const fileName = document.downloadPath.split('/').pop() || document.downloadPath.split('\\').pop();
          if (fileName) {
            const alternativeXmlPath = `downloads/scraping-results/XML/${fileName.replace('.pdf', '.xml')}`;
            const alternativeUrl = `/api/download-file?path=${encodeURIComponent(alternativeXmlPath)}`;
            xmlResponse = await fetch(alternativeUrl);
          }
        }
        
        if (xmlResponse.ok) {
          const xmlText = await xmlResponse.text();
          
          // Extraer información del XML
          const supplierInfo = extractSupplierInfo(xmlText);
          const invoiceLines = extractProductLines(xmlText);
          const invoiceTotal = extractInvoiceTotal(xmlText);
          
          setInvoiceData({
            supplierInfo,
            invoiceLines,
            invoiceTotal,
            documentNumber: document.documentNumber,
            date: document.date,
            xmlContent: xmlText,
            xmlFileName: xmlPath.split('/').pop() || 'documento.xml'
          });

          // Cargar el PDF correspondiente
          await loadPdf(document.downloadPath);
        } else {
          console.error('Error loading XML file');
        }
      }
    } catch (error) {
      console.error('Error loading invoice data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPdf = async (pdfPath: string) => {
    try {
      setIsPdfLoading(true);
      setPdfError(null);
      
      console.log('Loading PDF from path:', pdfPath);
      
      // Crear URL para el PDF con parámetro embed=true
      const pdfUrl = `/api/download-file?path=${encodeURIComponent(pdfPath)}&embed=true`;
      console.log('PDF URL:', pdfUrl);
      
      // Verificar que el PDF existe
      const response = await fetch(pdfUrl, { method: 'HEAD' });
      console.log('PDF response status:', response.status);
      
      if (response.ok) {
        console.log('PDF found, setting URL:', pdfUrl);
        setPdfUrl(pdfUrl);
      } else {
        console.log('PDF not found, trying alternative path');
        // Intentar ruta alternativa
        const fileName = pdfPath.split('/').pop() || pdfPath.split('\\').pop();
        if (fileName) {
          const alternativePdfPath = `downloads/scraping-results/PDF/${fileName}`;
          const alternativeUrl = `/api/download-file?path=${encodeURIComponent(alternativePdfPath)}&embed=true`;
          console.log('Trying alternative URL:', alternativeUrl);
          const altResponse = await fetch(alternativeUrl, { method: 'HEAD' });
          console.log('Alternative response status:', altResponse.status);
          
          if (altResponse.ok) {
            console.log('Alternative PDF found, setting URL:', alternativeUrl);
            setPdfUrl(alternativeUrl);
          } else {
            console.log('PDF not found in alternative location');
            setPdfError('PDF no encontrado');
          }
        } else {
          console.log('No filename extracted from path');
          setPdfError('PDF no encontrado');
        }
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      setPdfError('Error al cargar el PDF');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const extractSupplierInfo = (xmlText: string): SupplierInfo => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
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
      
      // Extraer nombre del proveedor
      let supplierNameElement = partyTaxScheme.querySelector('cbc\\:RegistrationName, RegistrationName');
      let supplierName = supplierNameElement?.textContent?.trim();
      let nameFound = !!supplierName;
      
      if (!supplierName) {
        supplierNameElement = supplierParty.querySelector('cac\\:Party cac\\:PartyName cbc\\:Name, Party PartyName Name');
        supplierName = supplierNameElement?.textContent?.trim();
        nameFound = !!supplierName;
      }
      
      supplierName = supplierName || 'No encontrado';
      
      // Extraer NIT del proveedor
      let supplierNitElement = partyTaxScheme.querySelector('cbc\\:CompanyID, CompanyID');
      let supplierNit = supplierNitElement?.textContent?.trim();
      let nitFound = !!supplierNit;
      
      if (!supplierNit) {
        supplierNitElement = supplierParty.querySelector('cac\\:Party cac\\:PartyIdentification cbc\\:ID, Party PartyIdentification ID');
        supplierNit = supplierNitElement?.textContent?.trim();
        nitFound = !!supplierNit;
      }
      
      supplierNit = supplierNit || 'No encontrado';
      
      // Extraer dirección
      const addressElement = partyTaxScheme.querySelector('cac\\:RegistrationAddress cac\\:AddressLine cbc\\:Line, RegistrationAddress AddressLine Line');
      const address = addressElement?.textContent?.trim() || 'No encontrado';
      const addressFound = !!addressElement?.textContent?.trim();
      
      // Extraer ciudad
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

  const extractProductLines = (xmlText: string): ProductLine[] => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const invoiceLineElements = xmlDoc.querySelectorAll('cac\\:InvoiceLine, InvoiceLine');
      
      if (!invoiceLineElements || invoiceLineElements.length === 0) {
        return [];
      }
      
      const lines = Array.from(invoiceLineElements).map((line, index) => {
        // Extraer ID de la línea
        const idElement = line.querySelector('cbc\\:ID, ID');
        const id = idElement?.textContent?.trim() || `${index + 1}`;
        
        // Extraer código del producto (usar ID como código)
        const productCode = id;
        
        // Extraer descripción del item
        const descriptionElement = line.querySelector('cac\\:Item cbc\\:Description, Item Description');
        const description = descriptionElement?.textContent?.trim() || 'No disponible';
        
        // Extraer cantidad
        const quantityElement = line.querySelector('cbc\\:InvoicedQuantity, InvoicedQuantity');
        const quantity = quantityElement?.textContent?.trim() || '0';
        
        // Extraer precio unitario
        const priceElement = line.querySelector('cac\\:Price cbc\\:PriceAmount, Price PriceAmount');
        const unitPrice = priceElement?.textContent?.trim() || '0';
        
        // Extraer descuento (por defecto 0)
        const discount = '0';
        
        // Extraer tasa de impuesto
        const taxElement = line.querySelector('cac\\:TaxTotal cac\\:TaxSubTotal cac\\:TaxCategory cac\\:Percent, TaxTotal TaxSubTotal TaxCategory Percent');
        const taxRate = taxElement?.textContent?.trim() ? `IVA ${taxElement.textContent.trim()}%` : 'IVA 19%';
        
        // Extraer impuesto de retención (por defecto vacío)
        const retentionTax = '';
        
        // Extraer monto total de la línea
        const totalElement = line.querySelector('cbc\\:LineExtensionAmount, LineExtensionAmount');
        const totalAmount = totalElement?.textContent?.trim() || '0';
        
        return {
          id,
          productCode,
          description,
          warehouse: '', // No disponible en XML estándar
          quantity,
          unitPrice,
          discount,
          taxRate,
          retentionTax,
          totalAmount
        };
      });
      
      return lines;
    } catch (error) {
      console.error('Error extracting product lines:', error);
      return [];
    }
  };

  const extractInvoiceTotal = (xmlText: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const legalMonetaryTotal = xmlDoc.querySelector('cac\\:LegalMonetaryTotal, LegalMonetaryTotal');
      
      if (!legalMonetaryTotal) {
        return { amount: '0', found: false };
      }
      
      const payableAmountElement = legalMonetaryTotal.querySelector('cbc\\:PayableAmount, PayableAmount');
      const payableAmount = payableAmountElement?.textContent?.trim() || '0';
      const found = !!payableAmountElement?.textContent?.trim() && payableAmount !== '0';
      
      return { amount: payableAmount, found };
    } catch (error) {
      console.error('Error extracting invoice total:', error);
      return { amount: '0', found: false };
    }
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    
    try {
      // Aquí implementarías la lógica de migración real
      // Por ahora simulamos el proceso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirigir de vuelta a la lista
      router.push('/migrate-invoices');
    } catch (error) {
      console.error('Error during migration:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount || '0');
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numAmount);
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

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cargando datos de la factura...
            </h3>
            <p className="text-gray-600">
              Extrayendo información del XML
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!invoiceData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar la factura
          </h3>
          <p className="text-gray-600 mb-4">
            No se pudo cargar la información de la factura
          </p>
          <Button onClick={() => router.push('/migrate-invoices')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/migrate-invoices')}
            className="mr-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <ArrowRightLeft className="h-6 w-6" />
          <div>
            <h1 className="text-xl font-bold">
              Migrar Factura
            </h1>
            <p className="text-blue-100 text-sm">
              Documento: {invoiceData.documentNumber} - {formatDate(invoiceData.date)}
            </p>
          </div>
        </div>

        {/* Sección Superior - PDF y Información del Proveedor */}
        <div className="flex-1 flex gap-4 p-4 min-h-0">
          {/* Sección PDF Embebido - Izquierda */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border">
            {isPdfLoading ? (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Cargando PDF...</h3>
                  <p className="text-sm text-gray-500">
                    Obteniendo el documento PDF
                  </p>
                </div>
              </div>
            ) : pdfError ? (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-300" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Error al cargar PDF</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {pdfError}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (invoiceData) {
                        // Reintentar cargar el PDF
                        const pdfPath = invoiceData.xmlContent.split('/').pop()?.replace('.xml', '.pdf') || 'documento.pdf';
                        loadPdf(pdfPath);
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : pdfUrl ? (
              <PDFViewerWrapper
                pdfUrl={pdfUrl}
                fileName={invoiceData.xmlFileName.replace('.xml', '.pdf')}
                onDownload={() => {
                  const downloadUrl = pdfUrl.replace('&embed=true', '');
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = invoiceData.xmlFileName.replace('.xml', '.pdf');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">SECCIÓN PARA PDF EMBEBIDO</h3>
                  <p className="text-sm text-gray-500">
                    Aquí se mostrará el PDF de la factura
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sección Información del Proveedor - Derecha */}
          <div className="w-80 bg-white rounded-lg shadow-sm border">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">INFORMACIÓN DEL PROVEEDOR</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">NIT</label>
                  <div className="flex items-center gap-2 mt-1">
                    {!invoiceData.supplierInfo.nitFound && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <span className={`text-sm font-medium ${invoiceData.supplierInfo.nitFound ? 'text-gray-900' : 'text-red-600'}`}>
                      {invoiceData.supplierInfo.nit}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">NOMBRE</label>
                  <div className="flex items-center gap-2 mt-1">
                    {!invoiceData.supplierInfo.nameFound && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <span className={`text-sm font-medium ${invoiceData.supplierInfo.nameFound ? 'text-gray-900' : 'text-red-600'}`}>
                      {invoiceData.supplierInfo.name}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">DIRECCIÓN</label>
                  <div className="flex items-start gap-2 mt-1">
                    {!invoiceData.supplierInfo.addressFound && <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />}
                    <span className={`text-sm ${invoiceData.supplierInfo.addressFound ? 'text-gray-900' : 'text-red-600'}`}>
                      {invoiceData.supplierInfo.address}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">CIUDAD</label>
                  <div className="flex items-center gap-2 mt-1">
                    {!invoiceData.supplierInfo.cityFound && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <span className={`text-sm ${invoiceData.supplierInfo.cityFound ? 'text-gray-900' : 'text-red-600'}`}>
                      {invoiceData.supplierInfo.city}
                    </span>
                  </div>
                </div>

                {/* Total de la Operación */}
                {invoiceData.invoiceTotal && invoiceData.invoiceTotal.amount !== '0' && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">TOTAL</label>
                    <div className="flex items-center gap-2 mt-1">
                      {!invoiceData.invoiceTotal.found && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      <span className={`text-lg font-bold ${invoiceData.invoiceTotal.found ? 'text-green-600' : 'text-red-600'}`}>
                        {invoiceData.invoiceTotal.found ? formatCurrency(invoiceData.invoiceTotal.amount) : 'No encontrado'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección Inferior - Tabla de Productos */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border mx-4 mb-4 min-h-0 flex flex-col">
          {/* Header de la tabla */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Líneas de Factura ({invoiceData.invoiceLines.length} items)
            </h3>
          </div>
          
          {/* Tabla de productos */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Producto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Descripción</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Bodega</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Cantidad</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Valor Unitario</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Descuento</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Impuesto a cargo</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Retención</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.invoiceLines.map((line, index) => (
                  <tr key={line.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      {line.productCode}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 max-w-xs">
                      <div className="truncate" title={line.description}>
                        {line.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-400">—</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">
                      {parseFloat(line.quantity || '0').toLocaleString('es-CO')}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">
                      {formatCurrency(line.unitPrice)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">
                      {formatCurrency(line.discount)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-gray-700">
                      {line.taxRate}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-gray-500">
                      {line.retentionTax || '—'}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                      {formatCurrency(line.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 sticky bottom-0">
                <tr className="border-t-2 border-gray-300">
                  <td colSpan={8} className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                    Total:
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(invoiceData.invoiceLines.reduce((sum, line) => sum + parseFloat(line.totalAmount || '0'), 0).toString())}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Barra de acciones fija en la parte inferior */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([invoiceData.xmlContent], { type: 'application/xml' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = invoiceData.xmlFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar XML
            </Button>
            {pdfUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Remover el parámetro embed para la descarga
                  const downloadUrl = pdfUrl.replace('&embed=true', '');
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = invoiceData.xmlFileName.replace('.xml', '.pdf');
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/migrate-invoices')}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleMigrate}
              disabled={isMigrating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isMigrating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Migrando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Migrar Factura
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
