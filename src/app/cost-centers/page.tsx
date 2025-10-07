"use client"

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Target,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Check,
  AlertCircle,
  Building2,
  DollarSign,
  Users
} from "lucide-react"

interface CostCenter {
  id?: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CostCentersPage() {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<CostCenter>({
    code: '',
    name: '',
    description: '',
    isActive: true,
    createdBy: ''
  });

  const loadCostCenters = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cost-centers');
      const result = await response.json();

      if (result.success) {
        setCostCenters(result.data.costCenters);
      } else {
        console.error('Error cargando centros de costo:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCostCenters();
  }, []);

  const handleEdit = (costCenter: CostCenter) => {
    setEditingCostCenter(costCenter);
    setForm({
      code: costCenter.code,
      name: costCenter.name,
      description: costCenter.description,
      isActive: costCenter.isActive,
      createdBy: costCenter.createdBy
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim() || !form.description.trim()) {
      alert('El código, nombre y descripción son requeridos');
      return;
    }

    try {
      setLoading(true);
      const url = editingCostCenter ? `/api/cost-centers/${editingCostCenter.id}` : '/api/cost-centers';
      const method = editingCostCenter ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        await loadCostCenters();
        setIsEditing(false);
        setEditingCostCenter(null);
        setForm({
          code: '',
          name: '',
          description: '',
          isActive: true,
          createdBy: ''
        });
        console.log('Centro de costo guardado exitosamente');
      } else {
        console.error('Error guardando centro de costo:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error guardando centro de costo:', error);
      alert('Error al guardar el centro de costo');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingCostCenter(null);
    setForm({
      code: '',
      name: '',
      description: '',
      isActive: true,
      createdBy: ''
    });
  };

  const handleDelete = async (costCenterId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este centro de costo?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/cost-centers/${costCenterId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadCostCenters();
        console.log('Centro de costo eliminado exitosamente');
      } else {
        console.error('Error eliminando centro de costo:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error eliminando centro de costo:', error);
      alert('Error al eliminar el centro de costo');
    } finally {
      setLoading(false);
    }
  };

  const filteredCostCenters = costCenters.filter(costCenter =>
    costCenter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    costCenter.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    costCenter.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Centros de Costo
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona los centros de costo para la distribución de gastos
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Centro de Costo
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por código, nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={loadCostCenters}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cost Centers List */}
        <Card>
          <CardHeader>
            <CardTitle>Centros de Costo ({filteredCostCenters.length})</CardTitle>
            <CardDescription>
              Lista de todos los centros de costo configurados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Cargando centros de costo...</p>
              </div>
            ) : filteredCostCenters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {searchTerm ? 'No se encontraron centros de costo' : 'No hay centros de costo configurados'}
                </p>
                <p className="text-sm">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primer centro de costo para comenzar'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCostCenters.map((costCenter) => (
                  <Card key={costCenter.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg">{costCenter.name}</h3>
                            <Badge className="bg-blue-100 text-blue-800">
                              {costCenter.code}
                            </Badge>
                            <Badge className={costCenter.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {costCenter.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{costCenter.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Creado por: {costCenter.createdBy}</span>
                            <span>Creado: {costCenter.createdAt ? formatDate(costCenter.createdAt) : '-'}</span>
                            {costCenter.updatedAt && (
                              <span>Actualizado: {formatDate(costCenter.updatedAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(costCenter)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(costCenter.id!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form for creating/editing cost center */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingCostCenter ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code" className="text-sm">Código *</Label>
                  <Input
                    id="code"
                    value={form.code}
                    onChange={(e) => setForm(prev => ({
                      ...prev,
                      code: e.target.value
                    }))}
                    placeholder="Ej: CC001"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="name" className="text-sm">Nombre *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Nombre del centro de costo"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-sm">Descripción *</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Descripción del centro de costo"
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    isActive: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="text-sm">Centro de costo activo</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingCostCenter ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
