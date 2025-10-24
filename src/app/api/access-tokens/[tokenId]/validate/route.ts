import { NextRequest, NextResponse } from 'next/server';
import { isTokenValid } from '@/lib/accessTokenService';

/**
 * GET /api/access-tokens/[tokenId]/validate
 * Verifica si un token específico es válido
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;

    if (!tokenId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de token requerido' 
        },
        { status: 400 }
      );
    }

    const isValid = await isTokenValid(tokenId);

    return NextResponse.json({
      success: true,
      data: {
        tokenId,
        isValid,
        checkedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error al verificar token:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al verificar token',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
