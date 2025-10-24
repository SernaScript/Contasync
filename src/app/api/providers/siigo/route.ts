import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getValidAccessToken } from '@/lib/accessTokenService';

export async function GET(request: NextRequest) {
  try {
    // Obtener las credenciales de Siigo
    const siigoCredentials = await prisma.siigoCredentials.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!siigoCredentials) {
      return NextResponse.json({
        success: false,
        error: 'No se encontraron credenciales de Siigo configuradas'
      }, { status: 400 });
    }

    // Obtener un token de acceso válido usando el servicio
    const accessToken = await getValidAccessToken();

    // Construir headers para la petición a Siigo
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Partner-Id': siigoCredentials.applicationType
    };

    console.log('Consultando proveedores desde Siigo...');
    console.log('Headers:', {
      'Content-Type': headers['Content-Type'],
      'Authorization': `Bearer ${accessToken.substring(0, 10)}...`,
      'Partner-Id': headers['Partner-Id']
    });

    // Realizar petición a la API de Siigo
    const siigoResponse = await fetch('https://api.siigo.com/v1/customers', {
      method: 'GET',
      headers
    });

    const responseData = await siigoResponse.json();

    console.log('Respuesta de Siigo:', {
      status: siigoResponse.status,
      statusText: siigoResponse.statusText,
      dataLength: Array.isArray(responseData) ? responseData.length : 'No es array'
    });

    if (!siigoResponse.ok) {
      return NextResponse.json({
        success: false,
        error: `Error en la API de Siigo: ${siigoResponse.status} ${siigoResponse.statusText}`,
        details: responseData
      }, { status: siigoResponse.status });
    }

    // Filtrar solo los proveedores (customers con tipo supplier)
    const suppliers = Array.isArray(responseData) 
      ? responseData.filter((customer: any) => 
          customer.type === 'supplier' || 
          customer.customer_type === 'supplier' ||
          customer.is_supplier === true
        )
      : [];

    console.log(`Se encontraron ${suppliers.length} proveedores en Siigo`);

    return NextResponse.json({
      success: true,
      data: {
        suppliers,
        totalCount: suppliers.length,
        rawResponse: responseData,
        requestInfo: {
          method: 'GET',
          endpoint: 'https://api.siigo.com/v1/customers',
          headers: {
            'Content-Type': headers['Content-Type'],
            'Authorization': 'Bearer [TOKEN]',
            'Partner-Id': headers['Partner-Id']
          },
          body: null,
          timestamp: new Date().toISOString(),
          responseStatus: siigoResponse.status,
          responseStatusText: siigoResponse.statusText
        }
      }
    });

  } catch (error) {
    console.error('Error consultando proveedores desde Siigo:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
