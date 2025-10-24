import { prisma } from '@/lib/prisma';
import { authenticateWithSiigo } from './siigoService';

export interface AccessTokenData {
  id: string;
  token: string;
  siigoCredentialsId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Obtiene un token de acceso válido para Siigo
 * Si no existe un token válido (menos de 24 horas), genera uno nuevo
 * @returns Token de acceso válido
 */
export async function getValidAccessToken(): Promise<string> {
  try {
    // Buscar credenciales activas de Siigo
    const credentials = await prisma.siigoCredentials.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!credentials) {
      throw new Error('No se encontraron credenciales de Siigo configuradas');
    }

    // Buscar el token más reciente para estas credenciales
    const existingToken = await prisma.accessToken.findFirst({
      where: { siigoCredentialsId: credentials.id },
      orderBy: { createdAt: 'desc' }
    });

    // Verificar si el token existe y es válido (menos de 24 horas)
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    if (existingToken && existingToken.createdAt > twentyFourHoursAgo) {
      // El token es válido, lo devolvemos
      return existingToken.token;
    }

    // El token no existe o ha expirado, generar uno nuevo
    const newToken = await generateNewAccessToken(credentials.id);
    return newToken;

  } catch (error) {
    console.error('Error al obtener token de acceso:', error);
    throw new Error('Error al obtener token de acceso válido');
  }
}

/**
 * Genera un nuevo token de acceso y lo guarda en la base de datos
 * @param siigoCredentialsId - ID de las credenciales de Siigo
 * @returns Nuevo token de acceso
 */
async function generateNewAccessToken(siigoCredentialsId: string): Promise<string> {
  try {
    // Autenticar con Siigo para obtener el token
    const token = await authenticateWithSiigo();

    // Guardar el nuevo token en la base de datos
    const accessToken = await prisma.accessToken.create({
      data: {
        token,
        siigoCredentialsId
      }
    });

    console.log(`Nuevo token de acceso generado: ${accessToken.id}`);
    return token;

  } catch (error) {
    console.error('Error al generar nuevo token de acceso:', error);
    throw new Error('Error al generar nuevo token de acceso');
  }
}

/**
 * Obtiene el historial de tokens de acceso
 * @param limit - Número máximo de tokens a devolver (por defecto 10)
 * @returns Lista de tokens de acceso
 */
export async function getAccessTokenHistory(limit: number = 10): Promise<AccessTokenData[]> {
  try {
    const tokens = await prisma.accessToken.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        siigoCredentials: {
          select: {
            apiUser: true,
            applicationType: true
          }
        }
      }
    });

    return tokens.map(token => ({
      id: token.id,
      token: token.token,
      siigoCredentialsId: token.siigoCredentialsId,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt
    }));

  } catch (error) {
    console.error('Error al obtener historial de tokens:', error);
    throw new Error('Error al obtener historial de tokens de acceso');
  }
}

/**
 * Limpia tokens antiguos (más de 7 días)
 * @returns Número de tokens eliminados
 */
export async function cleanupOldTokens(): Promise<number> {
  try {
    const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    
    const result = await prisma.accessToken.deleteMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo
        }
      }
    });

    console.log(`Se eliminaron ${result.count} tokens antiguos`);
    return result.count;

  } catch (error) {
    console.error('Error al limpiar tokens antiguos:', error);
    throw new Error('Error al limpiar tokens antiguos');
  }
}

/**
 * Verifica si un token es válido (menos de 24 horas)
 * @param tokenId - ID del token a verificar
 * @returns true si el token es válido, false en caso contrario
 */
export async function isTokenValid(tokenId: string): Promise<boolean> {
  try {
    const token = await prisma.accessToken.findUnique({
      where: { id: tokenId }
    });

    if (!token) {
      return false;
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    return token.createdAt > twentyFourHoursAgo;

  } catch (error) {
    console.error('Error al verificar validez del token:', error);
    return false;
  }
}
