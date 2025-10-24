import { prisma } from '@/lib/prisma';
import { decryptIfNeeded } from '@/lib/encryption';

export interface SiigoCredentials {
  apiUser: string;
  accessKey: string;
  applicationType: string;
}

/**
 * Obtiene las credenciales activas de Siigo descifradas
 * @returns Credenciales descifradas o null si no existen
 */
export async function getSiigoCredentials(): Promise<SiigoCredentials | null> {
  try {
    const credentials = await prisma.siigoCredentials.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!credentials) {
      return null;
    }

    return {
      apiUser: credentials.apiUser,
      accessKey: decryptIfNeeded(credentials.accessKey),
      applicationType: credentials.applicationType
    };
  } catch (error) {
    throw new Error('Error al obtener credenciales de Siigo');
  }
}

/**
 * Realiza una petición autenticada a la API de Siigo
 * @param endpoint - Endpoint de la API (sin la URL base)
 * @param options - Opciones adicionales para la petición
 * @returns Respuesta de la API
 */
export async function makeSiigoRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> {
  const credentials = await getSiigoCredentials();
  
  if (!credentials) {
    throw new Error('No se encontraron credenciales de Siigo configuradas');
  }

  const baseUrl = credentials.applicationType === 'sandbox' 
    ? 'https://api.siigo.com' 
    : 'https://api.siigo.com';

  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Partner-Id': credentials.applicationType,
    'Authorization': `Bearer ${credentials.accessKey}` // Asumiendo que Siigo usa Bearer token
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  return fetch(url, requestOptions);
}

/**
 * Autentica con la API de Siigo y obtiene el token de acceso
 * @returns Token de acceso
 */
export async function authenticateWithSiigo(): Promise<string> {
  const credentials = await getSiigoCredentials();
  
  if (!credentials) {
    throw new Error('No se encontraron credenciales de Siigo configuradas');
  }

  const response = await fetch('https://api.siigo.com/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Partner-Id': credentials.applicationType
    },
    body: JSON.stringify({
      username: credentials.apiUser,
      access_key: credentials.accessKey
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error de autenticación con Siigo: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  // Asumiendo que Siigo devuelve el token en el campo 'access_token' o 'token'
  return data.access_token || data.token || data.accessToken;
}

/**
 * Realiza una petición autenticada a la API de Siigo con token
 * @param endpoint - Endpoint de la API
 * @param options - Opciones adicionales para la petición
 * @returns Respuesta de la API
 */
export async function makeAuthenticatedSiigoRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const credentials = await getSiigoCredentials();
  
  if (!credentials) {
    throw new Error('No se encontraron credenciales de Siigo configuradas');
  }

  const token = await authenticateWithSiigo();
  
  const baseUrl = 'https://api.siigo.com';
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Partner-Id': credentials.applicationType,
    'Authorization': `Bearer ${token}`
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  return fetch(url, requestOptions);
}
