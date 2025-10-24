import { NextRequest, NextResponse } from 'next/server';
import { 
  getValidAccessToken, 
  getAccessTokenHistory, 
  cleanupOldTokens,
  isTokenValid 
} from '@/lib/accessTokenService';

/**
 * GET /api/access-tokens
 * Obtiene el historial de tokens de acceso
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeCurrent = searchParams.get('includeCurrent') === 'true';

    const history = await getAccessTokenHistory(limit);

    let response: any = {
      success: true,
      data: {
        history,
        total: history.length
      }
    };

    // Si se solicita, incluir el token actual
    if (includeCurrent) {
      try {
        const currentToken = await getValidAccessToken();
        response.data = {
          ...response.data,
          currentToken: {
            token: currentToken,
            isValid: true
          }
        };
      } catch (error) {
        response.data = {
          ...response.data,
          currentToken: {
            token: null,
            isValid: false,
            error: 'No se pudo obtener el token actual'
          }
        };
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error al obtener tokens de acceso:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener tokens de acceso',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/access-tokens
 * Fuerza la generación de un nuevo token de acceso
 */
export async function POST(request: NextRequest) {
  try {
    const { force } = await request.json().catch(() => ({}));

    if (force) {
      // Forzar generación de nuevo token
      const newToken = await getValidAccessToken();
      
      return NextResponse.json({
        success: true,
        message: 'Nuevo token generado exitosamente',
        data: {
          token: newToken,
          generatedAt: new Date().toISOString()
        }
      });
    } else {
      // Solo obtener token válido (puede ser existente o nuevo)
      const token = await getValidAccessToken();
      
      return NextResponse.json({
        success: true,
        message: 'Token obtenido exitosamente',
        data: {
          token,
          obtainedAt: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Error al generar token de acceso:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al generar token de acceso',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/access-tokens
 * Limpia tokens antiguos
 */
export async function DELETE(request: NextRequest) {
  try {
    const deletedCount = await cleanupOldTokens();

    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${deletedCount} tokens antiguos`,
      data: {
        deletedCount,
        cleanedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error al limpiar tokens antiguos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al limpiar tokens antiguos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
