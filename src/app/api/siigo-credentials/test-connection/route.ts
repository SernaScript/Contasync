import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiUser, accessKey } = body;

    // Validar que se proporcionen las credenciales
    if (!apiUser || !accessKey) {
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
        'Partner-Id': 'Contasync'
      },
      body: JSON.stringify({
        username: apiUser,
        access_key: accessKey
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
    console.error('Error testing SIIGO connection:', error);
    
    return NextResponse.json({
      success: false,
      message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      data: {
        error: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
