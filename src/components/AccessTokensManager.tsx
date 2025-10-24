"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  RefreshCw, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  Copy,
  AlertCircle
} from "lucide-react"
import { toast } from 'sonner';

interface AccessToken {
  id: string;
  token: string;
  siigoCredentialsId: string;
  createdAt: string;
  updatedAt: string;
}

interface AccessTokensResponse {
  success: boolean;
  data: {
    history: AccessToken[];
    total: number;
    currentToken?: {
      token: string;
      isValid: boolean;
      error?: string;
    };
  };
}

export function AccessTokensManager() {
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [isCurrentTokenValid, setIsCurrentTokenValid] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  // Cargar tokens al montar el componente
  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/access-tokens?limit=10&includeCurrent=true');
      const data: AccessTokensResponse = await response.json();
      
      if (data.success) {
        setTokens(data.data.history);
        if (data.data.currentToken) {
          setCurrentToken(data.data.currentToken.token);
          setIsCurrentTokenValid(data.data.currentToken.isValid);
        }
      } else {
        toast.error('Error al cargar tokens de acceso');
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      toast.error('Error al cargar tokens de acceso');
    } finally {
      setLoading(false);
    }
  };

  const refreshTokens = async () => {
    try {
      setRefreshing(true);
      await loadTokens();
      toast.success('Tokens actualizados');
    } catch (error) {
      toast.error('Error al actualizar tokens');
    } finally {
      setRefreshing(false);
    }
  };

  const generateNewToken = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/access-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: true }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Nuevo token generado exitosamente');
        await loadTokens();
      } else {
        toast.error('Error al generar nuevo token');
      }
    } catch (error) {
      console.error('Error generating token:', error);
      toast.error('Error al generar nuevo token');
    } finally {
      setRefreshing(false);
    }
  };

  const cleanupOldTokens = async () => {
    try {
      setCleaning(true);
      const response = await fetch('/api/access-tokens', {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        await loadTokens();
      } else {
        toast.error('Error al limpiar tokens antiguos');
      }
    } catch (error) {
      console.error('Error cleaning tokens:', error);
      toast.error('Error al limpiar tokens antiguos');
    } finally {
      setCleaning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Token copiado al portapapeles');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTokenValid = (createdAt: string) => {
    const tokenDate = new Date(createdAt);
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    return tokenDate > twentyFourHoursAgo;
  };

  const maskToken = (token: string) => {
    if (!showTokens) {
      return token.substring(0, 8) + '...' + token.substring(token.length - 8);
    }
    return token;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Tokens de Acceso
          </CardTitle>
          <CardDescription>
            Gestiona los tokens de acceso para la API de Siigo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Cargando tokens...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Tokens de Acceso
            </CardTitle>
            <CardDescription>
              Gestiona los tokens de acceso para la API de Siigo
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTokens(!showTokens)}
            >
              {showTokens ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showTokens ? 'Ocultar' : 'Mostrar'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTokens}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Token Actual */}
        {currentToken && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Token Actual
              </h3>
              <div className="flex items-center gap-2">
                {isCurrentTokenValid ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Válido
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Expirado
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-white rounded border text-sm font-mono">
                {maskToken(currentToken)}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(currentToken)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <Button
            onClick={generateNewToken}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Generar Nuevo Token
          </Button>
          <Button
            variant="outline"
            onClick={cleanupOldTokens}
            disabled={cleaning}
            className="flex items-center gap-2"
          >
            <Trash2 className={`h-4 w-4 ${cleaning ? 'animate-spin' : ''}`} />
            Limpiar Antiguos
          </Button>
        </div>

        {/* Historial de Tokens */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Historial de Tokens ({tokens.length})
          </h3>
          
          {tokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Key className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No hay tokens generados aún</p>
              <p className="text-sm">Los tokens aparecerán aquí cuando se generen automáticamente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token) => {
                const isValid = isTokenValid(token.createdAt);
                return (
                  <div
                    key={token.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {maskToken(token.token)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.token)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Creado: {formatDate(token.createdAt)}</span>
                          <span>Actualizado: {formatDate(token.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isValid ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Válido
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Expirado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Información
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Los tokens se renuevan automáticamente cada 24 horas</li>
            <li>• Los tokens válidos se reutilizan para múltiples peticiones</li>
            <li>• Los tokens antiguos se eliminan automáticamente después de 7 días</li>
            <li>• El sistema optimiza las llamadas a la API de Siigo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
