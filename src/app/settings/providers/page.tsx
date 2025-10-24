"use client"

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building2, 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Download,
  ArrowLeft,
  Search,
  Filter
} from "lucide-react"

interface Provider {
  id?: string;
  nit: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  isActive: boolean;
  isMigrated: boolean;
  migrationDate?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [providerForm, setProviderForm] = useState<Provider>({
    nit: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    country: 'Colombia',
    isActive: true,
    isMigrated: false,
    createdBy: ''
  });
  const [isMigratingProviders, setIsMigratingProviders] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive' | 'migrated'>('all');

  const loadProviders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/providers');
      const result = await response.json();

      if (result.success) {
        setProviders(result.data.providers);
      } else {
        console.error('Error cargando proveedores:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleEditProvider = (provider: Provider) => {
    setEditingProvider(provider);
    setProviderForm({
      nit: provider.nit,
      name: provider.name,
      email: provider.email || '',
      phone: provider.phone || '',
      address: provider.address || '',
      city: provider.city || '',
      department: provider.department || '',
      country: provider.country || 'Colombia',
      isActive: provider.isActive,
      isMigrated: provider.isMigrated,
      createdBy: provider.createdBy
    });
    setIsEditingProvider(true);
  };

  const handleProviderSave = async () => {
    if (!providerForm.nit.trim() || !providerForm.name.trim()) {
      alert('El NIT y el nombre son requeridos');
      return;
    }

    try {
      setLoading(true);
      const url = editingProvider ? `/api/providers/${editingProvider.id}` : '/api/providers';
      const method = editingProvider ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerForm),
      });

      const result = await response.json();

      if (result.success) {
        await loadProviders();
        setIsEditingProvider(false);
        setEditingProvider(null);
        setProviderForm({
          nit: '',
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          department: '',
          country: 'Colombia',
          isActive: true,
          isMigrated: false,
          createdBy: ''
        });
        console.log('Proveedor guardado exitosamente');
      } else {
        console.error('Error guardando proveedor:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error guardando proveedor:', error);
      alert('Error al guardar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderCancel = () => {
    setIsEditingProvider(false);
    setEditingProvider(null);
    setProviderForm({
      nit: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      department: '',
      country: 'Colombia',
      isActive: true,
      isMigrated: false,
      createdBy: ''
    });
  };

  const handleDeleteProvider = async (providerId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/providers/${providerId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadProviders();
        console.log('Proveedor eliminado exitosamente');
      } else {
        console.error('Error eliminando proveedor:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      alert('Error al eliminar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleMigrateProviders = async () => {
    if (!confirm('¿Estás seguro de que quieres migrar todos los proveedores desde Siigo? Esta acción puede tomar varios minutos.')) {
      return;
    }

    setIsMigratingProviders(true);
    setMigrationProgress(0);

    try {
      const response = await fetch('/api/providers/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        await loadProviders();
        alert('Migración de proveedores completada exitosamente');
      } else {
        console.error('Error migrando proveedores:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error migrando proveedores:', error);
      alert('Error al migrar los proveedores');
    } finally {
      setIsMigratingProviders(false);
      setMigrationProgress(0);
    }
  };

  // Filtrar proveedores
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (provider.email && provider.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterActive === 'all' ||
                         (filterActive === 'active' && provider.isActive) ||
                         (filterActive === 'inactive' && !provider.isActive) ||
                         (filterActive === 'migrated' && provider.isMigrated);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestión de Proveedores
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Administra los proveedores del sistema y migra datos desde Siigo
              </p>
            </div>
          </div>
        </div>

        {/* Controles de búsqueda y filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, NIT o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterActive === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterActive('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={filterActive === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterActive('active')}
                >
                  Activos
                </Button>
                <Button
                  variant={filterActive === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterActive('inactive')}
                >
                  Inactivos
                </Button>
                <Button
                  variant={filterActive === 'migrated' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterActive('migrated')}
                >
                  Migrados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones principales */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Proveedores ({filteredProviders.length})</CardTitle>
                <CardDescription>
                  Gestiona la información de tus proveedores
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleMigrateProviders}
                  disabled={isMigratingProviders}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isMigratingProviders ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Migrando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Migrar desde Siigo
                    </>
                  )}
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setEditingProvider(null);
                    setProviderForm({
                      nit: '',
                      name: '',
                      email: '',
                      phone: '',
                      address: '',
                      city: '',
                      department: '',
                      country: 'Colombia',
                      isActive: true,
                      isMigrated: false,
                      createdBy: ''
                    });
                    setIsEditingProvider(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proveedor
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando proveedores...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProviders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      {searchTerm || filterActive !== 'all' 
                        ? 'No se encontraron proveedores' 
                        : 'No hay proveedores configurados'
                      }
                    </p>
                    <p className="text-sm">
                      {searchTerm || filterActive !== 'all'
                        ? 'Intenta ajustar los filtros de búsqueda'
                        : 'Crea tu primer proveedor o migra desde Siigo'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredProviders.map((provider) => (
                      <Card key={provider.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{provider.name}</h3>
                              <Badge className={provider.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {provider.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                              {provider.isMigrated && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  Migrado
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div><strong>NIT:</strong> {provider.nit}</div>
                              {provider.email && <div><strong>Email:</strong> {provider.email}</div>}
                              {provider.phone && <div><strong>Teléfono:</strong> {provider.phone}</div>}
                              {provider.city && <div><strong>Ciudad:</strong> {provider.city}</div>}
                            </div>
                            {provider.address && (
                              <div className="text-sm text-gray-600 mt-1">
                                <strong>Dirección:</strong> {provider.address}
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                              <span>Creado por: {provider.createdBy}</span>
                              <span>Creado: {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : '-'}</span>
                              {provider.migrationDate && (
                                <span>Migrado: {new Date(provider.migrationDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProvider(provider)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProvider(provider.id!)}
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulario para crear/editar proveedor */}
        {isEditingProvider && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </CardTitle>
              <CardDescription>
                {editingProvider 
                  ? `Modifica la información del proveedor: ${editingProvider.name}`
                  : 'Agrega un nuevo proveedor al sistema'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="providerNit" className="text-sm">NIT *</Label>
                  <Input
                    id="providerNit"
                    value={providerForm.nit}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      nit: e.target.value
                    }))}
                    placeholder="Ej: 900123456-1"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="providerName" className="text-sm">Nombre *</Label>
                  <Input
                    id="providerName"
                    value={providerForm.name}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Nombre del proveedor"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="providerEmail" className="text-sm">Email</Label>
                  <Input
                    id="providerEmail"
                    type="email"
                    value={providerForm.email}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    placeholder="email@proveedor.com"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="providerPhone" className="text-sm">Teléfono</Label>
                  <Input
                    id="providerPhone"
                    value={providerForm.phone}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                    placeholder="+57 300 123 4567"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="providerCity" className="text-sm">Ciudad</Label>
                  <Input
                    id="providerCity"
                    value={providerForm.city}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      city: e.target.value
                    }))}
                    placeholder="Bogotá"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="providerDepartment" className="text-sm">Departamento</Label>
                  <Input
                    id="providerDepartment"
                    value={providerForm.department}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      department: e.target.value
                    }))}
                    placeholder="Cundinamarca"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="providerAddress" className="text-sm">Dirección</Label>
                <Input
                  id="providerAddress"
                  value={providerForm.address}
                  onChange={(e) => setProviderForm(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  placeholder="Calle 123 #45-67"
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="providerActive"
                    checked={providerForm.isActive}
                    onCheckedChange={(checked) => setProviderForm(prev => ({
                      ...prev,
                      isActive: checked as boolean
                    }))}
                  />
                  <Label htmlFor="providerActive" className="text-sm">Proveedor activo</Label>
                </div>
                {editingProvider && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="providerMigrated"
                      checked={providerForm.isMigrated}
                      onCheckedChange={(checked) => setProviderForm(prev => ({
                        ...prev,
                        isMigrated: checked as boolean
                      }))}
                    />
                    <Label htmlFor="providerMigrated" className="text-sm">Migrado desde Siigo</Label>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleProviderCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleProviderSave}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingProvider ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Barra de progreso de migración */}
        {isMigratingProviders && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Migrando proveedores desde Siigo...</h3>
                  <span className="text-sm text-gray-600">{migrationProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${migrationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Por favor espera mientras se migran los proveedores. Este proceso puede tomar varios minutos.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
