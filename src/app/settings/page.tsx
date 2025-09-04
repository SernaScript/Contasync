"use client"

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Shield, 
  Key, 
  Users, 
  Lock, 
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Database,
  Save
} from "lucide-react"

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  role: {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
  };
}

interface SiigoCredentials {
  id?: string;
  apiUser: string;
  accessKey: string;
  applicationType: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ConfiguracionPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("roles");
  const [siigoCredentials, setSiigoCredentials] = useState<SiigoCredentials>({
    apiUser: '',
    accessKey: '',
    applicationType: 'production'
  });
  const [siigoForm, setSiigoForm] = useState<SiigoCredentials>({
    apiUser: '',
    accessKey: '',
    applicationType: 'production'
  });
  const [isEditingSiigo, setIsEditingSiigo] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    isActive: true
  });

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/roles');
      const result = await response.json();

      if (result.success) {
        setRoles(result.data.roles);
      } else {
        console.error('Error cargando roles:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await fetch('/api/permissions');
      const result = await response.json();

      if (result.success) {
        setPermissions(result.data.permissions);
      } else {
        console.error('Error cargando permisos:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const result = await response.json();

      if (result.success) {
        setUsers(result.data.users);
      } else {
        console.error('Error cargando usuarios:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSiigoCredentials = async (includeRealKey = false) => {
    try {
      const url = includeRealKey 
        ? '/api/siigo-credentials?includeRealKey=true'
        : '/api/siigo-credentials';
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        if (result.data.credentials) {
          if (includeRealKey) {
            // Para el formulario: usar valores reales (sin enmascarar)
            setSiigoForm(result.data.credentials);
          } else {
            // Para visualización: enmascarar la access key
            const displayCredentials = {
              ...result.data.credentials,
              accessKey: '••••••••••••••••••••••••••••••••'
            };
            setSiigoCredentials(displayCredentials);
          }
        } else {
          // Si no hay credenciales, usar valores por defecto
          const defaultCredentials = {
            apiUser: '',
            accessKey: '',
            applicationType: 'production'
          };
          if (includeRealKey) {
            setSiigoForm(defaultCredentials);
          } else {
            setSiigoCredentials(defaultCredentials);
            setSiigoForm(defaultCredentials);
          }
        }
      } else {
        console.error('Error cargando credenciales SIIGO:', result.error);
        const defaultCredentials = {
          apiUser: '',
          accessKey: '',
          applicationType: 'production'
        };
        if (includeRealKey) {
          setSiigoForm(defaultCredentials);
        } else {
          setSiigoCredentials(defaultCredentials);
          setSiigoForm(defaultCredentials);
        }
      }
    } catch (error) {
      console.error('Error cargando credenciales SIIGO:', error);
      const defaultCredentials = {
        apiUser: '',
        accessKey: '',
        applicationType: 'production'
      };
      if (includeRealKey) {
        setSiigoForm(defaultCredentials);
      } else {
        setSiigoCredentials(defaultCredentials);
        setSiigoForm(defaultCredentials);
      }
    }
  };

  useEffect(() => {
    loadRoles();
    loadPermissions();
    loadUsers();
    loadSiigoCredentials();
  }, []);

  const handleSiigoSave = async () => {
    try {
      setLoading(true);
      
      // Validar que todos los campos estén llenos
      if (!siigoForm.apiUser || !siigoForm.accessKey || !siigoForm.applicationType) {
        alert('Todos los campos son requeridos');
        setLoading(false);
        return;
      }

      let response;
      if (siigoForm.id) {
        // Actualizar credenciales existentes
        response = await fetch('/api/siigo-credentials', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: siigoForm.id,
            apiUser: siigoForm.apiUser,
            accessKey: siigoForm.accessKey,
            applicationType: siigoForm.applicationType
          }),
        });
      } else {
        // Crear nuevas credenciales
        response = await fetch('/api/siigo-credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiUser: siigoForm.apiUser,
            accessKey: siigoForm.accessKey,
            applicationType: siigoForm.applicationType
          }),
        });
      }

      const result = await response.json();

      if (result.success) {
        // Actualizar ambos estados después de guardar exitosamente
        const displayCredentials = {
          ...result.data.credentials,
          accessKey: '••••••••••••••••••••••••••••••••'
        };
        setSiigoCredentials(displayCredentials);
        setSiigoForm(result.data.credentials);
        setIsEditingSiigo(false);
        console.log('Credenciales SIIGO guardadas exitosamente');
        // Aquí podrías mostrar un toast de éxito
      } else {
        console.error('Error guardando credenciales SIIGO:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error guardando credenciales SIIGO:', error);
      alert('Error al guardar las credenciales');
    } finally {
      setLoading(false);
    }
  };

  const handleSiigoCancel = async () => {
    setIsEditingSiigo(false);
    // Recargar las credenciales para restaurar el estado
    await loadSiigoCredentials();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      isActive: user.isActive
    });
    setIsEditingUser(true);
  };

  const handleUserSave = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          isActive: userForm.isActive
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar la lista de usuarios
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...userForm }
            : user
        ));
        setIsEditingUser(false);
        setEditingUser(null);
        // Mostrar mensaje de éxito
        console.log('Usuario actualizado exitosamente');
      } else {
        console.error('Error actualizando usuario:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUserCancel = () => {
    setIsEditingUser(false);
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      isActive: true
    });
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar la lista de usuarios
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ));
        console.log(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
      } else {
        console.error('Error actualizando estado del usuario:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      'SUPER_ADMIN': 'bg-red-100 text-red-800',
      'ADMIN': 'bg-orange-100 text-orange-800',
      'ACCOUNTING': 'bg-blue-100 text-blue-800',
      'TREASURY': 'bg-green-100 text-green-800',
      'LOGISTICS': 'bg-purple-100 text-purple-800',
      'BILLING': 'bg-indigo-100 text-indigo-800',
      'VIEWER': 'bg-gray-100 text-gray-800'
    };
    return colors[roleName] || 'bg-gray-100 text-gray-800';
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      'VIEW': 'bg-blue-100 text-blue-800',
      'CREATE': 'bg-green-100 text-green-800',
      'EDIT': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800',
      'MANAGE': 'bg-purple-100 text-purple-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const getResourceIcon = (resource: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'dashboard': <Key className="h-3 w-3" />,
      'accounting': <Shield className="h-3 w-3" />,
      'treasury': <Shield className="h-3 w-3" />,
      'logistics': <Shield className="h-3 w-3" />,
      'billing': <Shield className="h-3 w-3" />,
      'reports': <Key className="h-3 w-3" />,
      'users': <Users className="h-3 w-3" />,
      'roles': <Lock className="h-3 w-3" />,
      'settings': <Settings className="h-3 w-3" />
    };
    return icons[resource] || <Key className="h-3 w-3" />;
  };

  const getUserStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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
          <Settings className="h-8 w-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Configuración del Sistema
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gestiona roles, permisos y configuraciones del sistema
            </p>
          </div>
        </div>

        {/* Tabs de configuración */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Integraciones
            </TabsTrigger>
          </TabsList>

          {/* Tab de Roles */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Roles</CardTitle>
                    <CardDescription>
                      Los roles del sistema son estáticos y no se pueden modificar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando roles...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {roles.map((role) => (
                      <Card key={role.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={getRoleColor(role.name)}>
                              {role.displayName}
                            </Badge>
                            <div>
                              <h3 className="font-medium">{role.displayName}</h3>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Permisos del rol */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Permisos:</h4>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                              <Badge key={permission.id} variant="outline" className="text-xs">
                                {getResourceIcon(permission.resource)}
                                {permission.resource}:{permission.action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Usuarios */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>
                      Administra los usuarios del sistema y sus roles
                    </CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Usuario
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando usuarios...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {users.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getRoleColor(user.role.name)}>
                                  {user.role.displayName}
                                </Badge>
                                <Badge className={getUserStatusColor(user.isActive)}>
                                  {user.isActive ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Creado: {formatDate(user.createdAt)}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className={user.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                              >
                                {user.isActive ? 'Desactivar' : 'Activar'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modal de Edición de Usuario */}
            {isEditingUser && editingUser && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Editar Usuario</CardTitle>
                  <CardDescription>
                    Modifica la información del usuario: {editingUser.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Nombre</Label>
                        <Input
                          id="userName"
                          value={userForm.name}
                          onChange={(e) => setUserForm(prev => ({
                            ...prev,
                            name: e.target.value
                          }))}
                          placeholder="Nombre del usuario"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">Email</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm(prev => ({
                            ...prev,
                            email: e.target.value
                          }))}
                          placeholder="Email del usuario"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="userActive"
                        checked={userForm.isActive}
                        onCheckedChange={(checked) => setUserForm(prev => ({
                          ...prev,
                          isActive: checked as boolean
                        }))}
                      />
                      <Label htmlFor="userActive">Usuario activo</Label>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleUserSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button onClick={handleUserCancel} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab de Integraciones */}
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Integración SIIGO
                      {siigoCredentials.id ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Configurado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600">
                          No configurado
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Configura las credenciales para la integración con SIIGO ERP
                    </CardDescription>
                  </div>
                  {!isEditingSiigo && (
                    <Button 
                      onClick={async () => {
                        // Cargar los valores reales para el formulario
                        await loadSiigoCredentials(true);
                        setIsEditingSiigo(true);
                      }}
                      className={siigoCredentials.id ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                    >
                      {siigoCredentials.id ? (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Credenciales
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Credenciales
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isEditingSiigo ? (
                    // Formulario de edición
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="apiUser">Usuario API</Label>
                          <Input
                            id="apiUser"
                            value={siigoForm.apiUser}
                            onChange={(e) => setSiigoForm(prev => ({
                              ...prev,
                              apiUser: e.target.value
                            }))}
                            placeholder="Ingresa el usuario de la API"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accessKey">Access Key</Label>
                          <Input
                            id="accessKey"
                            type="password"
                            value={siigoForm.accessKey}
                            onChange={(e) => setSiigoForm(prev => ({
                              ...prev,
                              accessKey: e.target.value
                            }))}
                            placeholder="Ingresa la clave de acceso"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="applicationType">Tipo de Aplicación</Label>
                        <Input
                          id="applicationType"
                          value={siigoForm.applicationType}
                          onChange={(e) => setSiigoForm(prev => ({
                            ...prev,
                            applicationType: e.target.value
                          }))}
                          placeholder="Desarrollo, Pruebas o Producción"
                          list="applicationTypes"
                        />
                        <datalist id="applicationTypes">
                          <option value="development">Desarrollo</option>
                          <option value="staging">Pruebas</option>
                          <option value="production">Producción</option>
                        </datalist>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSiigoSave} className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                        <Button onClick={handleSiigoCancel} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Vista de solo lectura
                    <div className="space-y-4">
                      {siigoCredentials.id ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Usuario API</Label>
                              <p className="text-sm text-gray-900 mt-1">{siigoCredentials.apiUser}</p>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Access Key</Label>
                              <p className="text-sm text-gray-900 mt-1">{siigoCredentials.accessKey}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Tipo de Aplicación</Label>
                            <div className="mt-1">
                              <Badge variant="outline" className="capitalize">
                                {siigoCredentials.applicationType}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-xs text-gray-500">
                              Las credenciales están encriptadas y se almacenan de forma segura en el sistema.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay credenciales configuradas
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Configura las credenciales de SIIGO para habilitar la integración con el ERP.
                          </p>
                          <Button 
                            onClick={() => {
                              setSiigoForm({
                                apiUser: '',
                                accessKey: '',
                                applicationType: 'production'
                              });
                              setIsEditingSiigo(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Configurar Credenciales
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
