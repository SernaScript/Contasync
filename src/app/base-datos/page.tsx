"use client"

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InvoicesTable, InvoicesSummary } from '@/components/InvoicesTable';
import { Database } from "lucide-react"

interface InvoicesData {
  invoices: any[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  summary: {
    totalInvoices: number;
    totalSubtotal: number;
    totalTax: number;
    totalAmount: number;
  };
}

export default function BaseDatos() {
  const [invoicesData, setInvoicesData] = useState<InvoicesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    nit: '',
    startDate: '',
    endDate: '',
    status: '',
    page: 1
  });

  const loadInvoices = async (newFilters = filters) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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

    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Base de Datos - Facturas
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Consultas y gestión de facturas procesadas
            </p>
          </div>
        </div>

        {/* Filtros de búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Búsqueda</CardTitle>
            <CardDescription>
              Buscar y filtrar facturas en la base de datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="nit">NIT de la Empresa</Label>
                <Input
                  id="nit"
                  value={filters.nit}
                  onChange={(e) => setFilters(prev => ({ ...prev, nit: e.target.value }))}
                  placeholder="900123456"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Fecha Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  title="Seleccionar estado de factura"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="paid">Pagado</option>
                  <option value="overdue">Vencido</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
                <Button onClick={processExcel} variant="outline" disabled={loading}>
                  Procesar Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de facturas */}
        {invoicesData?.summary && (
          <InvoicesSummary summary={invoicesData.summary} />
        )}

        {/* Tabla de facturas */}
        <InvoicesTable 
          invoices={invoicesData?.invoices || []} 
          loading={loading}
        />

        {/* Paginación */}
        {invoicesData?.pagination && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Página {invoicesData.pagination.page} de {invoicesData.pagination.totalPages}
                  {' '}({invoicesData.pagination.totalCount} registros total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(invoicesData.pagination.page - 1)}
                    disabled={invoicesData.pagination.page <= 1 || loading}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(invoicesData.pagination.page + 1)}
                    disabled={invoicesData.pagination.page >= invoicesData.pagination.totalPages || loading}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!invoicesData && !loading && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Ingrese criterios de búsqueda para cargar facturas</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
