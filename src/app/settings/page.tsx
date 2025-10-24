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
  Save,
  Calculator,
  FileText,
  Table,
  Download,
  Info,
  UserCheck,
  Building2,
  Package,
  BarChart3,
  Target,
  Wifi,
  Link
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

interface DianCredentials {
  id?: string;
  nit: string;
  legalRepresentativeDocument: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AccountingRule {
  id?: string;
  name: string;
  description: string;
  ruleType: string;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
  excludedThirdParties?: ExcludedThirdParty[];
  providerAccountMappings?: ProviderAccountMapping[];
}

interface ExcludedThirdParty {
  id?: string;
  nit: string;
  description: string;
  isActive: boolean;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProviderAccountMapping {
  id?: string;
  providerNit: string;
  providerName: string;
  description: string;
  accountingAccount: string;
  paymentId: string;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SiigoTable {
  id?: string;
  name: string;
  description: string;
  tableType: 'CUSTOMERS' | 'SUPPLIERS' | 'PRODUCTS' | 'ACCOUNTS' | 'COST_CENTERS' | 'OTHER';
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tablas predefinidas de Siigo
const PREDEFINED_SIIGO_TABLES = [
  {
    name: 'Clientes',
    description: 'Tabla de clientes de Siigo para sincronización de datos de terceros',
    tableType: 'CUSTOMERS' as const,
    icon: UserCheck
  },
  {
    name: 'Proveedores',
    description: 'Tabla de proveedores de Siigo para gestión de cuentas por pagar',
    tableType: 'SUPPLIERS' as const,
    icon: Building2
  },
  {
    name: 'Productos y Servicios',
    description: 'Catálogo de productos y servicios de Siigo para facturación',
    tableType: 'PRODUCTS' as const,
    icon: Package
  },
  {
    name: 'Plan de Cuentas',
    description: 'Plan de cuentas contables de Siigo para contabilización',
    tableType: 'ACCOUNTS' as const,
    icon: BarChart3
  },
  {
    name: 'Centros de Costo',
    description: 'Centros de costo de Siigo para distribución de gastos',
    tableType: 'COST_CENTERS' as const,
    icon: Target
  }
];

export default function ConfiguracionPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("accounting-rules");
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
  
  // Estados para DIAN
  const [dianCredentials, setDianCredentials] = useState<DianCredentials>({
    nit: '',
    legalRepresentativeDocument: ''
  });
  const [dianForm, setDianForm] = useState<DianCredentials>({
    nit: '',
    legalRepresentativeDocument: ''
  });
  const [isEditingDian, setIsEditingDian] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    isActive: true
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [hasSuccessfulConnection, setHasSuccessfulConnection] = useState(false);
  
  // Estados para prueba de conexión DIAN
  const [isTestingDianConnection, setIsTestingDianConnection] = useState(false);
  const [dianConnectionTestResult, setDianConnectionTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [hasSuccessfulDianConnection, setHasSuccessfulDianConnection] = useState(false);
  const [accountingRules, setAccountingRules] = useState<AccountingRule[]>([]);
  const [isEditingRule, setIsEditingRule] = useState(false);
  const [editingRule, setEditingRule] = useState<AccountingRule | null>(null);
  const [ruleForm, setRuleForm] = useState<AccountingRule>({
    name: '',
    description: '',
    ruleType: 'EXCLUDED_THIRD_PARTIES',
    isActive: true,
    priority: 1
  });
  const [excludedThirdParties, setExcludedThirdParties] = useState<ExcludedThirdParty[]>([]);
  const [isManagingExcludedParties, setIsManagingExcludedParties] = useState(false);
  const [newExcludedParty, setNewExcludedParty] = useState<ExcludedThirdParty>({
    nit: '',
    description: '',
    isActive: true,
    createdBy: ''
  });
  const [providerAccountMappings, setProviderAccountMappings] = useState<ProviderAccountMapping[]>([]);
  const [isManagingProviderMappings, setIsManagingProviderMappings] = useState(false);
  const [newProviderMapping, setNewProviderMapping] = useState<ProviderAccountMapping>({
    providerNit: '',
    providerName: '',
    description: '',
    accountingAccount: '',
    paymentId: '',
    isActive: true,
    createdBy: ''
  });

  // Estados para Tablas de Siigo
  const [siigoTables, setSiigoTables] = useState<SiigoTable[]>([]);
  const [isEditingSiigoTable, setIsEditingSiigoTable] = useState(false);
  const [editingSiigoTable, setEditingSiigoTable] = useState<SiigoTable | null>(null);
  const [isShowingPredefinedTables, setIsShowingPredefinedTables] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [siigoTableForm, setSiigoTableForm] = useState<SiigoTable>({
    name: '',
    description: '',
    tableType: 'OTHER',
    isActive: true,
    createdBy: ''
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

  const loadAccountingRules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/accounting-rules');
      const result = await response.json();

      if (result.success) {
        setAccountingRules(result.data.rules);
      } else {
        console.error('Error cargando reglas contables:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSiigoTables = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/siigo-tables');
      const result = await response.json();

      if (result.success) {
        setSiigoTables(result.data.siigoTables);
      } else {
        console.error('Error cargando tablas de Siigo:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExcludedThirdParties = async (ruleId: string) => {
    try {
      const response = await fetch(`/api/accounting-rules/${ruleId}/excluded-parties`);
      const result = await response.json();

      if (result.success) {
        setExcludedThirdParties(result.data.excludedParties);
      } else {
        console.error('Error cargando terceros excluidos:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadProviderAccountMappings = async (ruleId: string) => {
    try {
      const response = await fetch(`/api/accounting-rules/${ruleId}/provider-mappings`);
      const result = await response.json();

      if (result.success) {
        setProviderAccountMappings(result.data.providerMappings);
      } else {
        console.error('Error cargando mapeos de proveedores:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
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

  const loadDianCredentials = async (includeRealData = false) => {
    try {
      const url = includeRealData 
        ? '/api/dian-credentials?includeRealData=true'
        : '/api/dian-credentials';
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        if (result.data.credentials) {
          if (includeRealData) {
            // Para el formulario: usar valores reales (sin enmascarar)
            setDianForm(result.data.credentials);
          } else {
            // Para visualización: enmascarar los datos sensibles
            const displayCredentials = {
              ...result.data.credentials,
              nit: result.data.credentials.nit ? '••••••••••••••••••••••••••••••••' : '',
              legalRepresentativeDocument: result.data.credentials.legalRepresentativeDocument ? '••••••••••••••••••••••••••••••••' : ''
            };
            setDianCredentials(displayCredentials);
          }
        } else {
          // Si no hay credenciales, usar valores por defecto
          const defaultCredentials = {
            nit: '',
            legalRepresentativeDocument: ''
          };
          if (includeRealData) {
            setDianForm(defaultCredentials);
          } else {
            setDianCredentials(defaultCredentials);
            setDianForm(defaultCredentials);
          }
        }
      } else {
        console.error('Error cargando credenciales DIAN:', result.error);
        const defaultCredentials = {
          nit: '',
          legalRepresentativeDocument: ''
        };
        if (includeRealData) {
          setDianForm(defaultCredentials);
        } else {
          setDianCredentials(defaultCredentials);
          setDianForm(defaultCredentials);
        }
      }
    } catch (error) {
      console.error('Error cargando credenciales DIAN:', error);
      const defaultCredentials = {
        nit: '',
        legalRepresentativeDocument: ''
      };
      if (includeRealData) {
        setDianForm(defaultCredentials);
      } else {
        setDianCredentials(defaultCredentials);
        setDianForm(defaultCredentials);
      }
    }
  };

  useEffect(() => {
    loadRoles();
    loadPermissions();
    loadUsers();
    loadSiigoCredentials();
    loadDianCredentials();
    loadAccountingRules();
    loadSiigoTables();
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

      // Validar que se haya probado la conexión exitosamente
      if (!hasSuccessfulConnection) {
        alert('Debes probar la conexión exitosamente antes de guardar las credenciales');
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
    setHasSuccessfulConnection(false);
    setConnectionTestResult(null);
    // Recargar las credenciales para restaurar el estado
    await loadSiigoCredentials();
  };

  const handleDianSave = async () => {
    try {
      setLoading(true);
      
      // Validar que todos los campos estén llenos
      if (!dianForm.nit || !dianForm.legalRepresentativeDocument) {
        alert('El NIT y el documento del representante legal son requeridos');
        setLoading(false);
        return;
      }

      // Validar que se haya probado la conexión exitosamente
      if (!hasSuccessfulDianConnection) {
        alert('Debes probar la conexión exitosamente antes de guardar las credenciales');
        setLoading(false);
        return;
      }

      let response;
      if (dianForm.id) {
        // Actualizar credenciales existentes
        response = await fetch('/api/dian-credentials', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: dianForm.id,
            nit: dianForm.nit,
            legalRepresentativeDocument: dianForm.legalRepresentativeDocument
          }),
        });
      } else {
        // Crear nuevas credenciales
        response = await fetch('/api/dian-credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nit: dianForm.nit,
            legalRepresentativeDocument: dianForm.legalRepresentativeDocument
          }),
        });
      }

      const result = await response.json();

      if (result.success) {
        // Actualizar ambos estados después de guardar exitosamente
        const displayCredentials = {
          ...result.data.credentials,
          nit: '••••••••••••••••••••••••••••••••',
          legalRepresentativeDocument: '••••••••••••••••••••••••••••••••'
        };
        setDianCredentials(displayCredentials);
        setDianForm(result.data.credentials);
        setIsEditingDian(false);
        console.log('Credenciales DIAN guardadas exitosamente');
        // Aquí podrías mostrar un toast de éxito
      } else {
        console.error('Error guardando credenciales DIAN:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error guardando credenciales DIAN:', error);
      alert('Error al guardar las credenciales');
    } finally {
      setLoading(false);
    }
  };

  const handleDianCancel = async () => {
    setIsEditingDian(false);
    setHasSuccessfulDianConnection(false);
    setDianConnectionTestResult(null);
    // Recargar las credenciales para restaurar el estado
    await loadDianCredentials();
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

  const testSiigoConnection = async () => {
    if (!siigoForm.apiUser || !siigoForm.accessKey) {
      setConnectionTestResult({
        success: false,
        message: 'Por favor, ingresa el usuario API y la clave de acceso antes de probar la conexión.'
      });
      setHasSuccessfulConnection(false);
      return;
    }

    setIsTestingConnection(true);
    setConnectionTestResult(null);
    setHasSuccessfulConnection(false);

    try {
      const response = await fetch('/api/siigo-credentials/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiUser: siigoForm.apiUser,
          accessKey: siigoForm.accessKey
        })
      });

      const result = await response.json();

      if (result.success) {
        const translatedMessage = translateSiigoError(result.data.status, result.message);
        setConnectionTestResult({
          success: true,
          message: translatedMessage
        });
        setHasSuccessfulConnection(true);
      } else {
        const translatedMessage = translateSiigoError(result.data?.status || 0, result.message);
        setConnectionTestResult({
          success: false,
          message: translatedMessage
        });
        setHasSuccessfulConnection(false);
      }
    } catch (error) {
      setConnectionTestResult({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
      setHasSuccessfulConnection(false);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testDianConnection = async () => {
    if (!dianForm.nit || !dianForm.legalRepresentativeDocument) {
      setDianConnectionTestResult({
        success: false,
        message: 'Por favor, ingresa el NIT y el documento del representante legal antes de probar la conexión.'
      });
      setHasSuccessfulDianConnection(false);
      return;
    }

    setIsTestingDianConnection(true);
    setDianConnectionTestResult(null);
    setHasSuccessfulDianConnection(false);

    try {
      const response = await fetch('/api/dian-credentials/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nit: dianForm.nit,
          legalRepresentativeDocument: dianForm.legalRepresentativeDocument
        })
      });

      const result = await response.json();

      if (result.success) {
        const translatedMessage = translateDianError(result.data.status, result.message);
        setDianConnectionTestResult({
          success: true,
          message: translatedMessage
        });
        setHasSuccessfulDianConnection(true);
      } else {
        const translatedMessage = translateDianError(result.data?.status || 0, result.message);
        setDianConnectionTestResult({
          success: false,
          message: translatedMessage
        });
        setHasSuccessfulDianConnection(false);
      }
    } catch (error) {
      setDianConnectionTestResult({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
      setHasSuccessfulDianConnection(false);
    } finally {
      setIsTestingDianConnection(false);
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

  const handleEditRule = (rule: AccountingRule) => {
    setEditingRule(rule);
    setRuleForm({
      name: rule.name,
      description: rule.description,
      ruleType: rule.ruleType,
      isActive: rule.isActive,
      priority: rule.priority
    });
    setIsEditingRule(true);
  };

  const handleRuleSave = async () => {
    try {
      setLoading(true);
      
      let response;
      if (editingRule?.id) {
        // Actualizar regla existente
        response = await fetch('/api/accounting-rules', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingRule.id,
            ...ruleForm
          }),
        });
      } else {
        // Crear nueva regla
        response = await fetch('/api/accounting-rules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ruleForm),
        });
      }

      const result = await response.json();

      if (result.success) {
        // Recargar las reglas
        await loadAccountingRules();
        setIsEditingRule(false);
        setEditingRule(null);
        setRuleForm({
          name: '',
          description: '',
          ruleType: 'EXCLUDED_THIRD_PARTIES',
          isActive: true,
          priority: 1
        });
        console.log('Regla contable guardada exitosamente');
      } else {
        console.error('Error guardando regla contable:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error guardando regla contable:', error);
      alert('Error al guardar la regla contable');
    } finally {
      setLoading(false);
    }
  };

  const handleRuleCancel = () => {
    setIsEditingRule(false);
    setEditingRule(null);
    setRuleForm({
      name: '',
      description: '',
      ruleType: 'EXCLUDED_THIRD_PARTIES',
      isActive: true,
      priority: 1
    });
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta regla contable?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting-rules/${ruleId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadAccountingRules();
        console.log('Regla contable eliminada exitosamente');
      } else {
        console.error('Error eliminando regla contable:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error eliminando regla contable:', error);
      alert('Error al eliminar la regla contable');
    }
  };

  const handleManageExcludedParties = async (rule: AccountingRule) => {
    setEditingRule(rule);
    setIsManagingExcludedParties(true);
    if (rule.id) {
      await loadExcludedThirdParties(rule.id);
    }
  };

  const handleAddExcludedParty = async () => {
    if (!newExcludedParty.nit.trim() || !newExcludedParty.description.trim()) {
      alert('El NIT y la descripción son requeridos');
      return;
    }

    if (!editingRule?.id) {
      alert('Error: No se ha seleccionado una regla');
      return;
    }

    try {
      const response = await fetch(`/api/accounting-rules/${editingRule.id}/excluded-parties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newExcludedParty,
          createdBy: 'Usuario Actual' // TODO: Obtener del contexto de autenticación
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadExcludedThirdParties(editingRule.id);
        setNewExcludedParty({
          nit: '',
          description: '',
          isActive: true,
          createdBy: ''
        });
        console.log('Tercero excluido agregado exitosamente');
      } else {
        console.error('Error agregando tercero excluido:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error agregando tercero excluido:', error);
      alert('Error al agregar el tercero excluido');
    }
  };

  const handleDeleteExcludedParty = async (partyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tercero excluido?')) {
      return;
    }

    if (!editingRule?.id) {
      alert('Error: No se ha seleccionado una regla');
      return;
    }

    try {
      const response = await fetch(`/api/accounting-rules/${editingRule.id}/excluded-parties/${partyId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadExcludedThirdParties(editingRule.id);
        console.log('Tercero excluido eliminado exitosamente');
      } else {
        console.error('Error eliminando tercero excluido:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error eliminando tercero excluido:', error);
      alert('Error al eliminar el tercero excluido');
    }
  };

  const handleCloseExcludedParties = () => {
    setIsManagingExcludedParties(false);
    setEditingRule(null);
    setExcludedThirdParties([]);
    setNewExcludedParty({
      nit: '',
      description: '',
      isActive: true,
      createdBy: ''
    });
  };

  const handleManageProviderMappings = async (rule: AccountingRule) => {
    setEditingRule(rule);
    setIsManagingProviderMappings(true);
    if (rule.id) {
      await loadProviderAccountMappings(rule.id);
    }
  };

  const handleAddProviderMapping = async () => {
    if (!newProviderMapping.providerNit.trim() || !newProviderMapping.providerName.trim() || !newProviderMapping.description.trim() || !newProviderMapping.accountingAccount.trim() || !newProviderMapping.paymentId.trim()) {
      alert('El NIT del proveedor, nombre, descripción, cuenta de contabilización y ID del pago son requeridos');
      return;
    }

    if (!editingRule?.id) {
      alert('Error: No se ha seleccionado una regla');
      return;
    }

    try {
      const response = await fetch(`/api/accounting-rules/${editingRule.id}/provider-mappings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProviderMapping,
          createdBy: 'Usuario Actual' // TODO: Obtener del contexto de autenticación
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadProviderAccountMappings(editingRule.id);
        setNewProviderMapping({
          providerNit: '',
          providerName: '',
          description: '',
          accountingAccount: '',
          paymentId: '',
          isActive: true,
          createdBy: ''
        });
        console.log('Asignación de proveedor agregada exitosamente');
      } else {
        console.error('Error agregando asignación de proveedor:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error agregando asignación de proveedor:', error);
      alert('Error al agregar la asignación de proveedor');
    }
  };

  const handleDeleteProviderMapping = async (mappingId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mapeo de proveedor?')) {
      return;
    }

    if (!editingRule?.id) {
      alert('Error: No se ha seleccionado una regla');
      return;
    }

    try {
      const response = await fetch(`/api/accounting-rules/${editingRule.id}/provider-mappings/${mappingId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadProviderAccountMappings(editingRule.id);
        console.log('Mapeo de proveedor eliminado exitosamente');
      } else {
        console.error('Error eliminando mapeo de proveedor:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error eliminando mapeo de proveedor:', error);
      alert('Error al eliminar el mapeo de proveedor');
    }
  };

  const handleCloseProviderMappings = () => {
    setIsManagingProviderMappings(false);
    setEditingRule(null);
    setProviderAccountMappings([]);
    setNewProviderMapping({
      providerNit: '',
      providerName: '',
      description: '',
      accountingAccount: '',
      paymentId: '',
      isActive: true,
      createdBy: ''
    });
  };

  // Funciones para Tablas de Siigo
  const handleEditSiigoTable = (table: SiigoTable) => {
    setEditingSiigoTable(table);
    setSiigoTableForm({
      name: table.name,
      description: table.description,
      tableType: table.tableType,
      isActive: table.isActive,
      createdBy: table.createdBy
    });
    setIsEditingSiigoTable(true);
  };

  const handleSiigoTableSave = async () => {
    if (!siigoTableForm.name.trim() || !siigoTableForm.description.trim()) {
      alert('El nombre y descripción son requeridos');
      return;
    }

    try {
      setLoading(true);
      const url = editingSiigoTable ? `/api/siigo-tables/${editingSiigoTable.id}` : '/api/siigo-tables';
      const method = editingSiigoTable ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siigoTableForm),
      });

      const result = await response.json();

      if (result.success) {
        await loadSiigoTables();
        setIsEditingSiigoTable(false);
        setEditingSiigoTable(null);
        setSiigoTableForm({
          name: '',
          description: '',
          tableType: 'OTHER',
          isActive: true,
          createdBy: ''
        });
        console.log('Tabla de Siigo guardada exitosamente');
      } else {
        console.error('Error guardando tabla de Siigo:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error guardando tabla de Siigo:', error);
      alert('Error al guardar la tabla de Siigo');
    } finally {
      setLoading(false);
    }
  };

  const handleSiigoTableCancel = () => {
    setIsEditingSiigoTable(false);
    setEditingSiigoTable(null);
    setSiigoTableForm({
      name: '',
      description: '',
      tableType: 'OTHER',
      isActive: true,
      createdBy: ''
    });
  };

  const handleDeleteSiigoTable = async (tableId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tabla de Siigo?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/siigo-tables/${tableId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadSiigoTables();
        console.log('Tabla de Siigo eliminada exitosamente');
      } else {
        console.error('Error eliminando tabla de Siigo:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error eliminando tabla de Siigo:', error);
      alert('Error al eliminar la tabla de Siigo');
    } finally {
      setLoading(false);
    }
  };

  const handleMigratePredefinedTable = async (predefinedTable: typeof PREDEFINED_SIIGO_TABLES[0]) => {
    try {
      setLoading(true);
      
      // Verificar si la tabla ya existe
      const existingTable = siigoTables.find(table => table.tableType === predefinedTable.tableType);
      if (existingTable) {
        alert('Esta tabla ya ha sido migrada anteriormente');
        return;
      }

      // Si es centros de costos, navegar a la página específica
      if (predefinedTable.tableType === 'COST_CENTERS') {
        setIsShowingPredefinedTables(false);
        window.location.href = '/cost-centers';
        return;
      }

      const response = await fetch('/api/siigo-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: predefinedTable.name,
          description: predefinedTable.description,
          tableType: predefinedTable.tableType,
          isActive: true,
          createdBy: 'Sistema' // Por ahora usamos 'Sistema' como creador
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadSiigoTables();
        setIsShowingPredefinedTables(false);
        console.log('Tabla de Siigo migrada exitosamente');
        alert(`Tabla "${predefinedTable.name}" migrada exitosamente`);
      } else {
        console.error('Error migrando tabla de Siigo:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error migrando tabla de Siigo:', error);
      alert('Error al migrar la tabla de Siigo');
    } finally {
      setLoading(false);
    }
  };

  const handleShowPredefinedTables = () => {
    setIsShowingPredefinedTables(true);
    setIsEditingSiigoTable(false);
    setEditingSiigoTable(null);
    // Iniciar animación de entrada
    setTimeout(() => setIsModalAnimating(true), 10);
  };

  const handleClosePredefinedTables = () => {
    // Iniciar animación de salida
    setIsModalAnimating(false);
    setTimeout(() => {
      setIsShowingPredefinedTables(false);
    }, 300); // Duración de la animación
  };

  const getRuleTypeInfo = (ruleType: string) => {
    const types: { [key: string]: { label: string; description: string; icon: React.ReactNode } } = {
      'EXCLUDED_THIRD_PARTIES': {
        label: 'Terceros Excluidos',
        description: 'Terceros que no deseas incluir dentro de la descarga y visualización de archivos',
        icon: <Users className="h-4 w-4" />
      },
      'PROVIDER_ACCOUNT_MAPPING': {
        label: 'Asignar Cuenta Según Proveedor',
        description: 'Asigna automáticamente facturas de proveedores específicos a cuentas contables',
        icon: <Database className="h-4 w-4" />
      }
    };
    return types[ruleType] || {
      label: ruleType,
      description: 'Tipo de regla no definido',
      icon: <FileText className="h-4 w-4" />
    };
  };

  const translateSiigoError = (status: number, message: string) => {
    const errorMessages: { [key: number]: string } = {
      200: 'Conexión exitosa con SIIGO API',
      201: 'Conexión exitosa con SIIGO API',
      400: 'Error en la solicitud: Faltan parámetros obligatorios o hay un problema con los datos enviados',
      401: 'Error de autenticación: Las credenciales proporcionadas no son válidas',
      403: 'Error de permisos: El usuario no tiene permisos para acceder a la API',
      404: 'Error: El recurso solicitado no existe en SIIGO API',
      408: 'Error de tiempo: SIIGO API no respondió dentro del tiempo esperado',
      409: 'Error de conflicto: Los datos enviados causan un conflicto en el servidor',
      415: 'Error de formato: Se envió un tipo de contenido no soportado',
      429: 'Error de límite: Se han enviado demasiadas solicitudes. Máximo 100 por minuto',
      500: 'Error interno del servidor de SIIGO API',
      503: 'SIIGO API no está disponible temporalmente por mantenimiento o sobrecarga',
      504: 'Error de tiempo: SIIGO API no pudo responder debido a sobrecarga temporal'
    };

    return errorMessages[status] || `Error ${status}: ${message}`;
  };

  const translateDianError = (status: number, message: string) => {
    const errorMessages: { [key: number]: string } = {
      200: 'Conexión exitosa con DIAN',
      201: 'Conexión exitosa con DIAN',
      400: 'Error en la solicitud: Faltan parámetros obligatorios o hay un problema con los datos enviados',
      401: 'Error de autenticación: Las credenciales proporcionadas no son válidas',
      403: 'Error de permisos: El usuario no tiene permisos para acceder a los servicios de DIAN',
      404: 'Error: El recurso solicitado no existe en DIAN',
      408: 'Error de tiempo: DIAN no respondió dentro del tiempo esperado',
      409: 'Error de conflicto: Los datos enviados causan un conflicto en el servidor',
      415: 'Error de formato: Se envió un tipo de contenido no soportado',
      429: 'Error de límite: Se han enviado demasiadas solicitudes a DIAN',
      500: 'Error interno del servidor de DIAN',
      503: 'DIAN no está disponible temporalmente por mantenimiento o sobrecarga',
      504: 'Error de tiempo: DIAN no pudo responder debido a sobrecarga temporal'
    };

    return errorMessages[status] || `Error ${status}: ${message}`;
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="accounting-rules" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Reglas Contables
            </TabsTrigger>
            <TabsTrigger value="siigo-tables" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Tablas de Siigo
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

          {/* Tab de Reglas Contables */}
          <TabsContent value="accounting-rules" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Reglas Contables</CardTitle>
                    <CardDescription>
                      Configura reglas automáticas para la contabilización de transacciones
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setEditingRule(null);
                      setRuleForm({
                        name: '',
                        description: '',
                        ruleType: 'EXCLUDED_THIRD_PARTIES',
                        isActive: true,
                        priority: 1
                      });
                      setIsEditingRule(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Regla
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando reglas contables...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {accountingRules.map((rule) => {
                      const ruleTypeInfo = getRuleTypeInfo(rule.ruleType);
                      return (
                        <Card key={rule.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                {ruleTypeInfo.icon}
                              </div>
                              <div>
                                <h3 className="font-medium">{rule.name}</h3>
                                <p className="text-sm text-gray-600">{rule.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    {ruleTypeInfo.label}
                                  </Badge>
                                  <Badge className={rule.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {rule.isActive ? 'Activa' : 'Inactiva'}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Prioridad: {rule.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {rule.ruleType === 'EXCLUDED_THIRD_PARTIES' && (
                                <div className="text-sm text-gray-500 mb-2">
                                  <div>Terceros excluidos: <span className="font-medium">{rule.excludedThirdParties?.length || 0}</span></div>
                                </div>
                              )}
                              {rule.ruleType === 'PROVIDER_ACCOUNT_MAPPING' && (
                                <div className="text-sm text-gray-500 mb-2">
                                  <div>Proveedores mapeados: <span className="font-medium">{rule.providerAccountMappings?.length || 0}</span></div>
                                </div>
                              )}
                              <div className="flex gap-2">
                                {rule.ruleType === 'EXCLUDED_THIRD_PARTIES' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleManageExcludedParties(rule)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Users className="h-3 w-3" />
                                  </Button>
                                )}
                                {rule.ruleType === 'PROVIDER_ACCOUNT_MAPPING' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleManageProviderMappings(rule)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Database className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditRule(rule)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => rule.id && handleDeleteRule(rule.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Información específica del tipo de regla */}
                          {rule.ruleType === 'EXCLUDED_THIRD_PARTIES' && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <h4 className="text-sm font-medium text-blue-700 mb-1">Descripción:</h4>
                              <p className="text-sm text-blue-600">{ruleTypeInfo.description}</p>
                            </div>
                          )}
                          
                          {rule.ruleType === 'PROVIDER_ACCOUNT_MAPPING' && (
                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                              <h4 className="text-sm font-medium text-green-700 mb-1">Descripción:</h4>
                              <p className="text-sm text-green-600">{ruleTypeInfo.description}</p>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                    
                    {accountingRules.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay reglas contables configuradas</p>
                        <p className="text-sm">Crea tu primera regla para automatizar la contabilización</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modal de Edición/Creación de Regla */}
            {isEditingRule && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>
                    {editingRule ? 'Editar Regla Contable' : 'Nueva Regla Contable'}
                  </CardTitle>
                  <CardDescription>
                    {editingRule 
                      ? `Modifica la regla: ${editingRule.name}`
                      : 'Crea una nueva regla para automatizar la contabilización'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ruleName">Nombre de la Regla</Label>
                        <Input
                          id="ruleName"
                          value={ruleForm.name}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            name: e.target.value
                          }))}
                          placeholder="Ej: Terceros Excluidos"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ruleType">Tipo de Regla</Label>
                        <select
                          id="ruleType"
                          value={ruleForm.ruleType}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            ruleType: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="EXCLUDED_THIRD_PARTIES">Terceros Excluidos</option>
                          <option value="PROVIDER_ACCOUNT_MAPPING">Asignar Cuenta Según Proveedor</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rulePriority">Prioridad</Label>
                        <Input
                          id="rulePriority"
                          type="number"
                          min="1"
                          value={ruleForm.priority}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            priority: parseInt(e.target.value) || 1
                          }))}
                          placeholder="1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ruleDescription">Descripción</Label>
                      <Input
                        id="ruleDescription"
                        value={ruleForm.description}
                        onChange={(e) => setRuleForm(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        placeholder={
                          ruleForm.ruleType === 'EXCLUDED_THIRD_PARTIES' 
                            ? "Terceros que no deseas incluir en descargas y visualizaciones"
                            : "Asignación automática de cuentas contables según proveedor"
                        }
                      />
                    </div>
                    
                    
                    {/* Información específica para Terceros Excluidos */}
                    {ruleForm.ruleType === 'EXCLUDED_THIRD_PARTIES' && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <h4 className="font-medium text-blue-800">Terceros Excluidos</h4>
                        </div>
                        <p className="text-sm text-blue-700">
                          Esta regla te permitirá excluir terceros específicos de las descargas y visualizaciones de archivos. 
                          Podrás agregar NITs de terceros que no deseas incluir en los procesos automáticos.
                        </p>
                      </div>
                    )}
                    
                    {/* Información específica para Asignar Cuenta Según Proveedor */}
                    {ruleForm.ruleType === 'PROVIDER_ACCOUNT_MAPPING' && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="h-4 w-4 text-green-600" />
                          <h4 className="font-medium text-green-800">Asignar Cuenta Según Proveedor</h4>
                        </div>
                        <p className="text-sm text-green-700">
                          Esta regla te permitirá asignar automáticamente facturas de proveedores específicos a cuentas contables. 
                          Cuando llegue una factura de un proveedor configurado, se aplicará automáticamente la cuenta de contabilización correspondiente.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ruleActive"
                        checked={ruleForm.isActive}
                        onCheckedChange={(checked) => setRuleForm(prev => ({
                          ...prev,
                          isActive: checked as boolean
                        }))}
                      />
                      <Label htmlFor="ruleActive">Regla activa</Label>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleRuleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        {editingRule ? 'Actualizar Regla' : 'Crear Regla'}
                      </Button>
                      <Button onClick={handleRuleCancel} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modal de Gestión de Asignación de Cuentas por Proveedor */}
            {isManagingProviderMappings && editingRule && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-600" />
                    Gestionar Asignación de Cuentas por Proveedor
                  </CardTitle>
                  <CardDescription>
                    Configura qué cuenta de contabilización usar para facturas de proveedores específicos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Formulario para agregar nueva asignación de proveedor */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">Agregar Nueva Asignación de Proveedor</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="providerNit" className="text-sm">NIT del Proveedor *</Label>
                          <Input
                            id="providerNit"
                            value={newProviderMapping.providerNit}
                            onChange={(e) => setNewProviderMapping(prev => ({
                              ...prev,
                              providerNit: e.target.value
                            }))}
                            placeholder="Ej: 900123456-1"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="providerName" className="text-sm">Nombre del Proveedor *</Label>
                          <Input
                            id="providerName"
                            value={newProviderMapping.providerName}
                            onChange={(e) => setNewProviderMapping(prev => ({
                              ...prev,
                              providerName: e.target.value
                            }))}
                            placeholder="Nombre del proveedor"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="providerDescription" className="text-sm">Descripción *</Label>
                          <Input
                            id="providerDescription"
                            value={newProviderMapping.description}
                            onChange={(e) => setNewProviderMapping(prev => ({
                              ...prev,
                              description: e.target.value
                            }))}
                            placeholder="Descripción de la asignación"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="providerAccountingAccount" className="text-sm">Cuenta de Contabilización *</Label>
                          <Input
                            id="providerAccountingAccount"
                            value={newProviderMapping.accountingAccount}
                            onChange={(e) => setNewProviderMapping(prev => ({
                              ...prev,
                              accountingAccount: e.target.value
                            }))}
                            placeholder="Ej: 220501 - Proveedores Nacionales"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="providerPaymentId" className="text-sm">ID del Pago *</Label>
                          <Input
                            id="providerPaymentId"
                            value={newProviderMapping.paymentId}
                            onChange={(e) => setNewProviderMapping(prev => ({
                              ...prev,
                              paymentId: e.target.value
                            }))}
                            placeholder="Ej: PAY-123456"
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Checkbox
                          id="providerActive"
                          checked={newProviderMapping.isActive}
                          onCheckedChange={(checked) => setNewProviderMapping(prev => ({
                            ...prev,
                            isActive: checked as boolean
                          }))}
                        />
                        <Label htmlFor="providerActive" className="text-sm">Regla activa</Label>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          onClick={handleAddProviderMapping}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar Asignación
                        </Button>
                      </div>
                    </div>

                    {/* Tabla de asignaciones de proveedores */}
                    <div>
                      <h4 className="font-medium mb-3">Asignaciones de Proveedores ({providerAccountMappings.length})</h4>
                      {providerAccountMappings.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <Database className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No hay asignaciones de proveedores configuradas</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">NIT</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Descripción</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Cuenta Contabilización</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">ID Pago</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Creado por</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Fecha Creación</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Fecha Actualización</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Actualizado por</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {providerAccountMappings.map((mapping) => (
                                <tr key={mapping.id} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900">
                                    {mapping.providerNit}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {mapping.providerName}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {mapping.description}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {mapping.accountingAccount}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {mapping.paymentId}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm">
                                    <Badge className={mapping.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                      {mapping.isActive ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {mapping.createdBy}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {mapping.createdAt ? formatDate(mapping.createdAt) : '-'}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {mapping.updatedAt ? formatDate(mapping.updatedAt) : '-'}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {mapping.updatedBy || '-'}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => mapping.id && handleDeleteProviderMapping(mapping.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button onClick={handleCloseProviderMappings} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modal de Gestión de Terceros Excluidos */}
            {isManagingExcludedParties && editingRule && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Gestionar Terceros Excluidos
                  </CardTitle>
                  <CardDescription>
                    Administra los NITs de terceros que no deseas incluir en descargas y visualizaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Formulario para agregar nuevo tercero excluido */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">Agregar Nuevo Tercero Excluido</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="excludedNit" className="text-sm">NIT *</Label>
                          <Input
                            id="excludedNit"
                            value={newExcludedParty.nit}
                            onChange={(e) => setNewExcludedParty(prev => ({
                              ...prev,
                              nit: e.target.value
                            }))}
                            placeholder="Ej: 900123456-1"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="excludedDescription" className="text-sm">Descripción del Cambio *</Label>
                          <Input
                            id="excludedDescription"
                            value={newExcludedParty.description}
                            onChange={(e) => setNewExcludedParty(prev => ({
                              ...prev,
                              description: e.target.value
                            }))}
                            placeholder="Descripción del cambio"
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Checkbox
                          id="excludedActive"
                          checked={newExcludedParty.isActive}
                          onCheckedChange={(checked) => setNewExcludedParty(prev => ({
                            ...prev,
                            isActive: checked as boolean
                          }))}
                        />
                        <Label htmlFor="excludedActive" className="text-sm">Regla activa</Label>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          onClick={handleAddExcludedParty}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar Tercero
                        </Button>
                      </div>
                    </div>

                    {/* Tabla de terceros excluidos */}
                    <div>
                      <h4 className="font-medium mb-3">Terceros Excluidos ({excludedThirdParties.length})</h4>
                      {excludedThirdParties.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No hay terceros excluidos configurados</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">NIT</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Descripción</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Creado por</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Fecha Creación</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Fecha Actualización</th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {excludedThirdParties.map((party) => (
                                <tr key={party.id} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900">
                                    {party.nit}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {party.description}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm">
                                    <Badge className={party.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                      {party.isActive ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {party.createdBy}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {party.createdAt ? formatDate(party.createdAt) : '-'}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                                    {party.updatedAt ? formatDate(party.updatedAt) : '-'}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => party.id && handleDeleteExcludedParty(party.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button onClick={handleCloseExcludedParties} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab de Tablas de Siigo */}
          <TabsContent value="siigo-tables" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Tablas de Siigo</CardTitle>
                    <CardDescription>
                      Administra las tablas de referencia para la integración con Siigo
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleShowPredefinedTables}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nueva Tabla
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {siigoTables.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Table className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No hay tablas de Siigo configuradas</p>
                    <p className="text-sm">Crea tu primera tabla para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {siigoTables.map((table) => (
                      <Card key={table.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{table.name}</h3>
                              <Badge className={table.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {table.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                              <Badge variant="outline">
                                {table.tableType}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{table.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Creado por: {table.createdBy}</span>
                              <span>Creado: {table.createdAt ? new Date(table.createdAt).toLocaleDateString() : '-'}</span>
                              {table.updatedAt && (
                                <span>Actualizado: {new Date(table.updatedAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSiigoTable(table)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSiigoTable(table.id!)}
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

            {/* Formulario para crear/editar tabla de Siigo */}
            {isEditingSiigoTable && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingSiigoTable ? 'Editar Tabla de Siigo' : 'Nueva Tabla de Siigo'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siigoTableName" className="text-sm">Nombre *</Label>
                      <Input
                        id="siigoTableName"
                        value={siigoTableForm.name}
                        onChange={(e) => setSiigoTableForm(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        placeholder="Nombre de la tabla"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siigoTableType" className="text-sm">Tipo de Tabla *</Label>
                      <select
                        id="siigoTableType"
                        value={siigoTableForm.tableType}
                        onChange={(e) => setSiigoTableForm(prev => ({
                          ...prev,
                          tableType: e.target.value as any
                        }))}
                        className="w-full h-8 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CUSTOMERS">Clientes</option>
                        <option value="SUPPLIERS">Proveedores</option>
                        <option value="PRODUCTS">Productos</option>
                        <option value="ACCOUNTS">Cuentas</option>
                        <option value="COST_CENTERS">Centros de Costo</option>
                        <option value="OTHER">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="siigoTableDescription" className="text-sm">Descripción *</Label>
                    <Input
                      id="siigoTableDescription"
                      value={siigoTableForm.description}
                      onChange={(e) => setSiigoTableForm(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                      placeholder="Descripción de la tabla"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="siigoTableActive"
                      checked={siigoTableForm.isActive}
                      onCheckedChange={(checked) => setSiigoTableForm(prev => ({
                        ...prev,
                        isActive: checked as boolean
                      }))}
                    />
                    <Label htmlFor="siigoTableActive" className="text-sm">Tabla activa</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSiigoTableCancel}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSiigoTableSave}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {editingSiigoTable ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modal para mostrar tablas predefinidas */}
            {isShowingPredefinedTables && (
              <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
                isModalAnimating 
                  ? 'bg-black bg-opacity-50' 
                  : 'bg-black bg-opacity-0'
              }`}>
                <div className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 transform ${
                  isModalAnimating 
                    ? 'scale-100 opacity-100 translate-y-0' 
                    : 'scale-95 opacity-0 translate-y-4'
                }`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Tablas de Siigo Disponibles</h2>
                        <p className="text-gray-600 mt-1">
                          Selecciona las tablas que deseas migrar desde Siigo
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleClosePredefinedTables}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cerrar
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                      {PREDEFINED_SIIGO_TABLES.map((table, index) => {
                        const isAlreadyMigrated = siigoTables.some(existingTable => 
                          existingTable.tableType === table.tableType
                        );
                        const IconComponent = table.icon;
                        
                        return (
                          <Card 
                            key={index} 
                            className={`p-3 transition-all duration-300 ${
                              isAlreadyMigrated 
                                ? 'opacity-50' 
                                : 'hover:shadow-md hover:scale-105 cursor-pointer'
                            } ${
                              isModalAnimating 
                                ? 'animate-in slide-in-from-bottom-4 fade-in' 
                                : 'animate-out slide-out-to-bottom-4 fade-out'
                            }`}
                            style={{
                              animationDelay: `${index * 100}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconComponent className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-sm text-gray-900 truncate">{table.name}</h3>
                                  {isAlreadyMigrated && (
                                    <Badge className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5">
                                      Migrada
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{table.description}</p>
                                <div className="flex items-center justify-end">
                                  <Button
                                    onClick={() => handleMigratePredefinedTable(table)}
                                    disabled={isAlreadyMigrated}
                                    className="flex items-center gap-1 h-6 px-2 text-xs"
                                    size="sm"
                                  >
                                    {isAlreadyMigrated ? (
                                      <>
                                        <Check className="h-3 w-3" />
                                        Ya Migrada
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-3 w-3" />
                                        Migrar
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                    
                    {siigoTables.length > 0 && (
                      <div className={`p-4 bg-blue-50 rounded-lg transition-all duration-300 ${
                        isModalAnimating 
                          ? 'animate-in slide-in-from-bottom-4 fade-in' 
                          : 'animate-out slide-out-to-bottom-4 fade-out'
                      }`}
                      style={{
                        animationDelay: `${PREDEFINED_SIIGO_TABLES.length * 100}ms`,
                        animationFillMode: 'both'
                      }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium text-blue-900">Tablas ya migradas</h4>
                        </div>
                        <p className="text-sm text-blue-700">
                          Las tablas marcadas como "Ya Migrada" no pueden ser migradas nuevamente. 
                          Si necesitas actualizar una tabla existente, puedes editarla desde la lista principal.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab de Integraciones */}
          <TabsContent value="integrations" className="space-y-6">
            {/* Header de Integraciones */}
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Integraciones del Sistema</h2>
              <p className="text-gray-600">Conecta tu sistema con servicios externos para automatizar procesos</p>
            </div>

            {/* Grid de Integraciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Integración SIIGO */}
              <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full -translate-y-16 translate-x-16"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden border-2 border-blue-100">
                      <img 
                        src="/Siigo_id70a6CpFG_1.jpeg" 
                        alt="SIIGO" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900">SIIGO ERP</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Sistema de gestión empresarial para contabilidad y facturación
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                  {/* Estado de conexión */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {siigoCredentials.id ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-700">Conectado</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-medium text-orange-700">No configurado</span>
                        </>
                      )}
                    </div>
                    {siigoCredentials.id && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {siigoCredentials.applicationType}
                      </Badge>
                    )}
                  </div>

                  {/* Información de usuario */}
                  {siigoCredentials.id && !isEditingSiigo && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Key className="h-4 w-4" />
                        <span>Usuario: <strong>{siigoCredentials.apiUser}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Botón de test de conexión con credenciales almacenadas */}
                  {siigoCredentials.id && !isEditingSiigo && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Wifi className="h-4 w-4" />
                          <span>Probar conexión con credenciales almacenadas</span>
                        </div>
                        <Button 
                          size="sm"
                          onClick={async () => {
                            setIsTestingConnection(true);
                            setConnectionTestResult(null);
                            setHasSuccessfulConnection(false);

                            try {
                              const response = await fetch('/api/siigo-credentials/test-connection', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  useStoredCredentials: true
                                })
                              });

                              const result = await response.json();
                              setConnectionTestResult(result);
                              setHasSuccessfulConnection(result.success);
                            } catch (error) {
                              setConnectionTestResult({
                                success: false,
                                message: 'Error de conexión: ' + (error instanceof Error ? error.message : 'Error desconocido')
                              });
                              setHasSuccessfulConnection(false);
                            } finally {
                              setIsTestingConnection(false);
                            }
                          }}
                          disabled={isTestingConnection}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isTestingConnection ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Probando...
                            </>
                          ) : (
                            <>
                              <Wifi className="h-3 w-3 mr-2" />
                              Probar Conexión
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Formulario de configuración */}
                  {isEditingSiigo && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-medium text-gray-900">Configurar Credenciales</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor="apiUser" className="text-sm font-medium">Usuario API</Label>
                          <Input
                            id="apiUser"
                            value={siigoForm.apiUser}
                            onChange={(e) => setSiigoForm(prev => ({
                              ...prev,
                              apiUser: e.target.value
                            }))}
                            placeholder="Ingresa tu usuario API"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="accessKey" className="text-sm font-medium">Access Key</Label>
                          <Input
                            id="accessKey"
                            type="password"
                            value={siigoForm.accessKey}
                            onChange={(e) => setSiigoForm(prev => ({
                              ...prev,
                              accessKey: e.target.value
                            }))}
                            placeholder="Ingresa tu clave de acceso"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="applicationType" className="text-sm font-medium">Tipo de Aplicación</Label>
                          <select
                            id="applicationType"
                            value={siigoForm.applicationType}
                            onChange={(e) => setSiigoForm(prev => ({
                              ...prev,
                              applicationType: e.target.value
                            }))}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="development">Desarrollo</option>
                            <option value="staging">Pruebas</option>
                            <option value="production">Producción</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resultado del test de conexión */}
                  {connectionTestResult && (
                    <div className={`p-3 rounded-lg border ${
                      connectionTestResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className={`flex items-center gap-2 ${
                        connectionTestResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {connectionTestResult.success ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">
                          {connectionTestResult.message}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2 pt-2">
                    {!isEditingSiigo ? (
                      <>
                        <Button 
                          size="sm"
                          onClick={async () => {
                            await loadSiigoCredentials(true);
                            setIsEditingSiigo(true);
                            setHasSuccessfulConnection(false);
                            setConnectionTestResult(null);
                          }}
                          className={siigoCredentials.id ? "bg-blue-600 hover:bg-blue-700 flex-1" : "bg-green-600 hover:bg-green-700 flex-1"}
                        >
                          {siigoCredentials.id ? (
                            <>
                              <Edit className="h-3 w-3 mr-2" />
                              Editar
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-2" />
                              Configurar
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          onClick={handleSiigoCancel} 
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="h-3 w-3 mr-2" />
                          Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={testSiigoConnection}
                          disabled={isTestingConnection || !siigoForm.apiUser || !siigoForm.accessKey}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                          {isTestingConnection ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Probando...
                            </>
                          ) : (
                            <>
                              <Wifi className="h-3 w-3 mr-2" />
                              Probar
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSiigoSave}
                          disabled={!hasSuccessfulConnection}
                          className={hasSuccessfulConnection ? "bg-green-600 hover:bg-green-700 flex-1" : "bg-gray-400 cursor-not-allowed flex-1"}
                        >
                          <Save className="h-3 w-3 mr-2" />
                          Guardar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Integración DIAN */}
              <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full -translate-y-16 translate-x-16"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden border-2 border-blue-100">
                      <img 
                        src="/Dian_(Colombia)_logo.svg" 
                        alt="DIAN" 
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900">DIAN</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Dirección de Impuestos y Aduanas Nacionales de Colombia
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                  {/* Estado de conexión */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {dianCredentials.id ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-700">Conectado</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-medium text-orange-700">No configurado</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Información de usuario */}
                  {dianCredentials.id && !isEditingDian && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Key className="h-4 w-4" />
                        <span>NIT: <strong>{dianCredentials.nit}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Formulario de configuración */}
                  {isEditingDian && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-medium text-gray-900">Configurar Credenciales</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor="dianNit" className="text-sm font-medium">NIT</Label>
                          <Input
                            id="dianNit"
                            type="number"
                            value={dianForm.nit}
                            onChange={(e) => setDianForm(prev => ({
                              ...prev,
                              nit: e.target.value
                            }))}
                            placeholder="Ingresa el NIT de la empresa"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="dianLegalDocument" className="text-sm font-medium">Documento Representante Legal</Label>
                          <Input
                            id="dianLegalDocument"
                            type="number"
                            value={dianForm.legalRepresentativeDocument}
                            onChange={(e) => setDianForm(prev => ({
                              ...prev,
                              legalRepresentativeDocument: e.target.value
                            }))}
                            placeholder="Ingresa el documento del representante legal"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resultado del test de conexión */}
                  {dianConnectionTestResult && (
                    <div className={`p-3 rounded-lg border ${
                      dianConnectionTestResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className={`flex items-center gap-2 ${
                        dianConnectionTestResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {dianConnectionTestResult.success ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">
                          {dianConnectionTestResult.message}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2 pt-2">
                    {!isEditingDian ? (
                      <>
                        {dianCredentials.id && (
                          <Button 
                            size="sm"
                            onClick={testDianConnection}
                            disabled={isTestingDianConnection}
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            {isTestingDianConnection ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Probando...
                              </>
                            ) : (
                              <>
                                <Wifi className="h-3 w-3 mr-2" />
                                Probar Conexión
                              </>
                            )}
                          </Button>
                        )}
                        <Button 
                          size="sm"
                          onClick={async () => {
                            await loadDianCredentials(true);
                            setIsEditingDian(true);
                            setHasSuccessfulDianConnection(false);
                            setDianConnectionTestResult(null);
                          }}
                          className={dianCredentials.id ? "bg-blue-600 hover:bg-blue-700 flex-1" : "bg-green-600 hover:bg-green-700 flex-1"}
                        >
                          {dianCredentials.id ? (
                            <>
                              <Edit className="h-3 w-3 mr-2" />
                              Editar
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-2" />
                              Configurar
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          onClick={handleDianCancel} 
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="h-3 w-3 mr-2" />
                          Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={testDianConnection}
                          disabled={isTestingDianConnection || !dianForm.nit || !dianForm.legalRepresentativeDocument}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                          {isTestingDianConnection ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Probando...
                            </>
                          ) : (
                            <>
                              <Wifi className="h-3 w-3 mr-2" />
                              Probar
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleDianSave}
                          disabled={!hasSuccessfulDianConnection}
                          className={hasSuccessfulDianConnection ? "bg-green-600 hover:bg-green-700 flex-1" : "bg-gray-400 cursor-not-allowed flex-1"}
                        >
                          <Save className="h-3 w-3 mr-2" />
                          Guardar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sección de futuras integraciones */}
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-700">Más integraciones</h3>
                  <p className="text-sm text-gray-500">Próximamente más conectores disponibles</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
