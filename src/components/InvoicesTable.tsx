import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Invoice {
  id: string;
  invoiceNumber: string;
  documentType: string;
  issueDate: string;
  dueDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  supplierName?: string;
  supplierNit?: string;
  description?: string;
  observations?: string;
  company: {
    nit: string;
    name?: string;
  };
}

interface InvoicesTableProps {
  invoices: Invoice[];
  loading?: boolean;
  onStatusChange?: (invoiceId: string, newStatus: string) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  pending: 'Pendiente',
  paid: 'Pagado',
  overdue: 'Vencido',
  cancelled: 'Cancelado'
};

export function InvoicesTable({ invoices, loading = false, onStatusChange }: InvoicesTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron facturas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturas ({invoices.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Factura</th>
                <th className="text-left p-2 font-medium">Fecha Emisión</th>
                <th className="text-left p-2 font-medium">Proveedor</th>
                <th className="text-right p-2 font-medium">Subtotal</th>
                <th className="text-right p-2 font-medium">IVA</th>
                <th className="text-right p-2 font-medium">Total</th>
                <th className="text-center p-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{invoice.documentType}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div>
                      <div>{formatDate(invoice.issueDate)}</div>
                      {invoice.dueDate && (
                        <div className="text-sm text-gray-500">
                          Vence: {formatDate(invoice.dueDate)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{invoice.supplierName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{invoice.supplierNit || ''}</div>
                    </div>
                  </td>
                  <td className="p-2 text-right">{formatCurrency(invoice.subtotal)}</td>
                  <td className="p-2 text-right">{formatCurrency(invoice.tax)}</td>
                  <td className="p-2 text-right font-medium">{formatCurrency(invoice.total)}</td>
                  <td className="p-2 text-center">
                    <Badge className={statusColors[invoice.status as keyof typeof statusColors]}>
                      {statusLabels[invoice.status as keyof typeof statusLabels] || invoice.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface InvoicesSummaryProps {
  summary: {
    totalInvoices: number;
    totalSubtotal: number;
    totalTax: number;
    totalAmount: number;
  };
}

export function InvoicesSummary({ summary }: InvoicesSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{summary.totalInvoices}</div>
          <div className="text-sm text-gray-500">Total Facturas</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(summary.totalSubtotal)}
          </div>
          <div className="text-sm text-gray-500">Subtotal</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(summary.totalTax)}
          </div>
          <div className="text-sm text-gray-500">IVA</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(summary.totalAmount)}
          </div>
          <div className="text-sm text-gray-500">Total</div>
        </CardContent>
      </Card>
    </div>
  );
}
