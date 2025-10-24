import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptIfNeeded } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiUser, accessKey, useStoredCredentials } = body;

    let finalApiUser = apiUser;
    let finalAccessKey = accessKey;

    let storedCredentials = null;
    
    // Si se solicita usar credenciales almacenadas
    if (useStoredCredentials) {
      storedCredentials = await prisma.siigoCredentials.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      if (!storedCredentials) {
        return NextResponse.json({
          success: false,
          error: 'No se encontraron credenciales almacenadas'
        }, { status: 404 });
      }

      finalApiUser = storedCredentials.apiUser;
      finalAccessKey = decryptIfNeeded(storedCredentials.accessKey);
    }

    // Validar que se proporcionen las credenciales
    if (!finalApiUser || !finalAccessKey) {
      return NextResponse.json({
        success: false,
        error: 'Usuario API y clave de acceso son requeridos'
      }, { status: 400 });
    }

    // Realizar la petición a SIIGO API desde el servidor
    const siigoResponse = await fetch('https://api.siigo.com/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Partner-Id': useStoredCredentials ? storedCredentials.applicationType : 'Contasync'
      },
      body: JSON.stringify({
        username: finalApiUser,
        access_key: finalAccessKey
      })
    });

    const responseText = await siigoResponse.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    // Capturar headers de la respuesta
    const responseHeaders: { [key: string]: string } = {};
    siigoResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    if (siigoResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Conexión exitosa con SIIGO API',
        data: {
          status: siigoResponse.status,
          statusText: siigoResponse.statusText,
          headers: responseHeaders,
          body: responseData
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Error en la conexión: ${siigoResponse.status} ${siigoResponse.statusText}`,
        data: {
          status: siigoResponse.status,
          statusText: siigoResponse.statusText,
          headers: responseHeaders,
          body: responseData
        }
      }, { status: siigoResponse.status });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      data: {
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }, { status: 500 });
  }
}
