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
  Filter,
  Check
} from "lucide-react"

interface Provider {
  id?: string;
  siigoId: string;
  type: string;
  personType: string;
  idTypeCode: string;
  idTypeName: string;
  identification: string;
  name: string;
  active: boolean;
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
    siigoId: '',
    type: 'Customer',
    personType: 'Person',
    idTypeCode: '',
    idTypeName: '',
    identification: '',
    name: '',
    active: true,
    isMigrated: false,
    createdBy: ''
  });
  const [isMigratingProviders, setIsMigratingProviders] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive' | 'migrated'>('all');
  
  // Estados para datos de Siigo
  const [isLoadingSiigo, setIsLoadingSiigo] = useState(false);
  const [siigoResult, setSiigoResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

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
      siigoId: provider.siigoId,
      type: provider.type,
      personType: provider.personType,
      idTypeCode: provider.idTypeCode,
      idTypeName: provider.idTypeName,
      identification: provider.identification,
      name: provider.name,
      active: provider.active,
      isMigrated: provider.isMigrated,
      createdBy: provider.createdBy
    });
    setIsEditingProvider(true);
  };

  const handleProviderSave = async () => {
    if (!providerForm.identification.trim() || !providerForm.name.trim()) {
      alert('La identificación y el nombre son requeridos');
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
          siigoId: '',
          type: 'Customer',
          personType: 'Person',
          idTypeCode: '',
          idTypeName: '',
          identification: '',
          name: '',
          active: true,
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
      siigoId: '',
      type: 'Customer',
      personType: 'Person',
      idTypeCode: '',
      idTypeName: '',
      identification: '',
      name: '',
      active: true,
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
        
        // Mostrar resultado detallado de la migración
        const { data } = result;
        const message = `Migración completada:
        
• Total encontrados: ${data.totalFound}
• Migrados: ${data.migrated}
• Saltados (ya existían): ${data.skipped}
• Errores: ${data.errors}

${data.migrated > 0 ? '✅ Los proveedores se han migrado exitosamente' : 'ℹ️ No se migraron nuevos proveedores'}`;

        alert(message);
        
        // Si hay errores, mostrarlos en consola
        if (data.errorDetails && data.errorDetails.length > 0) {
          console.warn('Errores durante la migración:', data.errorDetails);
        }
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

  const handleConsultSiigo = async () => {
    setIsLoadingSiigo(true);
    setSiigoResult(null);

    try {
      const response = await fetch('/api/providers/siigo');
      const result = await response.json();

      if (result.success) {
        setSiigoResult({
          success: true,
          message: `Consulta exitosa: Se encontraron ${result.data.totalCount} proveedores en Siigo`,
          details: result.data
        });
        console.log('Consulta a Siigo exitosa:', result.data);
      } else {
        setSiigoResult({
          success: false,
          message: result.error || 'Error desconocido al consultar Siigo',
          details: result.details
        });
        console.error('Error consultando Siigo:', result.error);
      }
    } catch (error) {
      setSiigoResult({
        success: false,
        message: 'Error de conexión al consultar Siigo',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
      console.error('Error consultando Siigo:', error);
    } finally {
      setIsLoadingSiigo(false);
    }
  };

  // Filtrar proveedores
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.identification.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.siigoId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === 'all' ||
                         (filterActive === 'active' && provider.active) ||
                         (filterActive === 'inactive' && !provider.active) ||
                         (filterActive === 'migrated' && provider.isMigrated);
    
    return matchesSearch && matchesFilter;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = filteredProviders.slice(startIndex, endIndex);

  // Resetear página cuando cambien los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterActive]);

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
                  onClick={handleConsultSiigo}
                  disabled={isLoadingSiigo}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoadingSiigo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Consultando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Consultar Siigo
                    </>
                  )}
                </Button>
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
                      siigoId: '',
                      type: 'Customer',
                      personType: 'Person',
                      idTypeCode: '',
                      idTypeName: '',
                      identification: '',
                      name: '',
                      active: true,
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
                  <>
                    {/* Tabla de proveedores */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700">
                              NIT
                            </th>
                            <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700">
                              Identificación
                            </th>
                            <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700">
                              Estado
                            </th>
                            <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700">
                              Creado
                            </th>
                            <th className="border border-gray-200 px-3 py-2 text-center text-xs font-medium text-gray-700">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProviders.map((provider) => (
                            <tr key={provider.id} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-3 py-2">
                                <div className="text-xs text-gray-900">{provider.identification}</div>
                              </td>
                              <td className="border border-gray-200 px-3 py-2">
                                <div className="text-xs font-medium text-gray-900">{provider.name}</div>
                              </td>
                              <td className="border border-gray-200 px-3 py-2">
                                <Badge className={`text-xs ${provider.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                  {provider.active ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </td>
                              <td className="border border-gray-200 px-3 py-2">
                                <div className="text-xs text-gray-900">
                                  {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : '-'}
                                </div>
                              </td>
                              <td className="border border-gray-200 px-3 py-2">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteProvider(provider.id!)}
                                    className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                          Mostrando {startIndex + 1} a {Math.min(endIndex, filteredProviders.length)} de {filteredProviders.length} proveedores
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const pageNum = i + 1;
                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className="w-8 h-8 p-0"
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                            {totalPages > 5 && (
                              <>
                                <span className="text-gray-500">...</span>
                                <Button
                                  variant={currentPage === totalPages ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(totalPages)}
                                  className="w-8 h-8 p-0"
                                >
                                  {totalPages}
                                </Button>
                              </>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
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
                  <Label htmlFor="providerSiigoId" className="text-sm">ID de Siigo</Label>
                  <Input
                    id="providerSiigoId"
                    value={providerForm.siigoId}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      siigoId: e.target.value
                    }))}
                    placeholder="ID único de Siigo"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="providerIdentification" className="text-sm">Identificación *</Label>
                  <Input
                    id="providerIdentification"
                    value={providerForm.identification}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      identification: e.target.value
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
                  <Label htmlFor="providerType" className="text-sm">Tipo</Label>
                  <select
                    id="providerType"
                    value={providerForm.type}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      type: e.target.value
                    }))}
                    className="h-8 text-sm border border-gray-300 rounded-md px-3 w-full"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Supplier">Supplier</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="providerPersonType" className="text-sm">Tipo de Persona</Label>
                  <select
                    id="providerPersonType"
                    value={providerForm.personType}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      personType: e.target.value
                    }))}
                    className="h-8 text-sm border border-gray-300 rounded-md px-3 w-full"
                  >
                    <option value="Person">Persona</option>
                    <option value="Company">Empresa</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="providerIdTypeCode" className="text-sm">Código Tipo ID</Label>
                  <Input
                    id="providerIdTypeCode"
                    value={providerForm.idTypeCode}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      idTypeCode: e.target.value
                    }))}
                    placeholder="Ej: 13"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="providerIdTypeName" className="text-sm">Nombre Tipo ID</Label>
                  <Input
                    id="providerIdTypeName"
                    value={providerForm.idTypeName}
                    onChange={(e) => setProviderForm(prev => ({
                      ...prev,
                      idTypeName: e.target.value
                    }))}
                    placeholder="Ej: Cédula de ciudadanía"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="providerActive"
                    checked={providerForm.active}
                    onCheckedChange={(checked) => setProviderForm(prev => ({
                      ...prev,
                      active: checked as boolean
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

        {/* Resultado de consulta a Siigo */}
        {siigoResult && (
          <Card>
            <CardContent className="pt-6">
              <div className={`flex items-center gap-3 ${
                siigoResult.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {siigoResult.success ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <X className="h-6 w-6" />
                )}
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    siigoResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {siigoResult.success ? 'Consulta Exitosa' : 'Error en la Consulta'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    siigoResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {siigoResult.message}
                  </p>
                  {siigoResult.details && !siigoResult.success && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-red-600 hover:text-red-800">
                        Ver detalles del error
                      </summary>
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                        <pre className="text-xs text-red-800 overflow-auto max-h-32">
                          {JSON.stringify(siigoResult.details, null, 2)}
                        </pre>
                      </div>
                    </details>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSiigoResult(null)}
                  className={siigoResult.success ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
