"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "@/components/ui/loading"
import { LoadingOverlay } from "@/components/ui/loading"
import { Skeleton, TableSkeleton } from "@/components/ui/loading"
import { useApiLoading } from "@/hooks/useLoading"
import { 
  Search, 
  Download, 
  FileText, 
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react"

interface Invoice {
  id: string;
  nit: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: string;
  supplierName: string;
}

interface InvoicesData {
  invoices: Invoice[];
  totalCount: number;
  totalAmount: number;
}

export default function BaseDatos() {
  const [invoicesData, setInvoicesData] = useState<InvoicesData | null>(null);
  const [filters, setFilters] = useState({
    nit: '',
    startDate: '',
    endDate: '',
    status: '',
    page: 1
  });

  const { isLoading, apiCall } = useApiLoading({
    initialLoading: true,
    loadingText: 'Cargando facturas...'
  });

  const loadInvoices = async (newFilters = filters) => {
    try {
      const params = new URLSearchParams();
      
      if (newFilters.nit) params.append('nit', newFilters.nit);
      if (newFilters.startDate) params.append('startDate', newFilters.startDate);
      if (newFilters.endDate) params.append('endDate', newFilters.endDate);
      if (newFilters.status) params.append('status', newFilters.status);
      params.append('page', newFilters.page.toString());
      params.append('limit', '50');

      const response = await fetch(`/api/invoices?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setInvoicesData(result.data);
      } else {
        console.error('Error cargando facturas:', result.error);
        alert('Error cargando facturas: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleSearch = () => {
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    loadInvoices(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    loadInvoices(newFilters);
  };

  const processExcel = async () => {
    if (!filters.nit || !filters.startDate || !filters.endDate) {
      alert('Por favor ingrese NIT, fecha inicial y fecha final');
      return;
    }

    await apiCall(async () => {
      const response = await fetch('/api/process-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nit: filters.nit,
          startDate: filters.startDate,
          endDate: filters.endDate
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Procesamiento exitoso: ${result.data.processedRecords}/${result.data.totalRecords} registros procesados`);
        loadInvoices(); // Recargar los datos
      } else {
        alert('Error procesando Excel: ' + result.error);
      }
    }, 'Procesando archivo Excel...');
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadInvoices();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PAID': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'OVERDUE': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'OVERDUE':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Base de Datos de Facturas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gestiona y consulta todas las facturas del sistema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Facturas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {invoicesData?.totalCount || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">
                ${invoicesData?.totalAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  placeholder="Ingrese NIT"
                  value={filters.nit}
                  onChange={(e) => setFilters({ ...filters, nit: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="startDate">Fecha Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  className="w-full h-9 px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  aria-label="Seleccionar estado de factura"
                >
                  <option value="">Todos</option>
                  <option value="PAID">Pagada</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="OVERDUE">Vencida</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </Button>
              <LoadingButton
                onClick={processExcel}
                isLoading={isLoading}
                loadingText="Procesando..."
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Procesar Excel
              </LoadingButton>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Facturas */}
        <Card>
          <CardHeader>
            <CardTitle>Facturas Encontradas</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingOverlay 
              isLoading={isLoading} 
              text="Cargando facturas..."
              spinnerSize="lg"
            >
              {invoicesData ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">NIT</th>
                        <th className="text-left p-3 font-medium">N° Factura</th>
                        <th className="text-left p-3 font-medium">Proveedor</th>
                        <th className="text-left p-3 font-medium">Fecha Emisión</th>
                        <th className="text-left p-3 font-medium">Fecha Vencimiento</th>
                        <th className="text-left p-3 font-medium">Monto</th>
                        <th className="text-left p-3 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicesData.invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              {invoice.nit}
                            </div>
                          </td>
                          <td className="p-3 font-mono">{invoice.invoiceNumber}</td>
                          <td className="p-3">{invoice.supplierName}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              {new Date(invoice.issueDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-3 font-mono">${invoice.amount.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                              {getStatusIcon(invoice.status)}
                              {invoice.status === 'PAID' && 'Pagada'}
                              {invoice.status === 'PENDING' && 'Pendiente'}
                              {invoice.status === 'OVERDUE' && 'Vencida'}
                              {invoice.status === 'CANCELLED' && 'Cancelada'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <TableSkeleton rows={10} columns={7} />
              )}
            </LoadingOverlay>

            {/* Paginación */}
            {invoicesData && invoicesData.totalCount > 50 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando página {filters.page} de {Math.ceil(invoicesData.totalCount / 50)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= Math.ceil(invoicesData.totalCount / 50)}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
