import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getValidAccessToken } from '@/lib/accessTokenService';

export async function POST(request: NextRequest) {
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

    // Obtener un token de acceso válido
    const accessToken = await getValidAccessToken();

    // Construir headers para la petición a Siigo
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Partner-Id': siigoCredentials.applicationType
    };

    console.log('Iniciando migración de proveedores desde Siigo...');

    // Función para obtener todos los datos paginados
    const getAllCustomers = async () => {
      let allCustomers: any[] = [];
      let page = 1;
      let hasMorePages = true;
      let totalPages = 0;

      while (hasMorePages) {
        console.log(`Obteniendo página ${page} de customers...`);
        
        const siigoResponse = await fetch(`https://api.siigo.com/v1/customers?page=${page}`, {
          method: 'GET',
          headers
        });

        if (!siigoResponse.ok) {
          throw new Error(`Error en la API de Siigo: ${siigoResponse.status} ${siigoResponse.statusText}`);
        }

        const responseData = await siigoResponse.json();
        
        console.log(`Página ${page} - Respuesta:`, {
          isArray: Array.isArray(responseData),
          hasResults: !!responseData.results,
          resultsLength: responseData.results?.length || 0,
          current_page: responseData.current_page,
          total_pages: responseData.total_pages,
          total_items: responseData.total_items,
          has_more: responseData.has_more
        });
        
        // Verificar si la respuesta tiene paginación
        if (Array.isArray(responseData)) {
          // Respuesta directa como array
          allCustomers = allCustomers.concat(responseData);
          hasMorePages = responseData.length > 0; // Continuar si hay datos
          console.log(`Página ${page}: ${responseData.length} customers obtenidos (formato array)`);
        } else if (responseData.results && Array.isArray(responseData.results)) {
          // Respuesta con estructura de paginación
          allCustomers = allCustomers.concat(responseData.results);
          console.log(`Página ${page}: ${responseData.results.length} customers obtenidos (formato paginado)`);
          
          // Determinar si hay más páginas
          if (responseData.total_pages) {
            totalPages = responseData.total_pages;
            hasMorePages = page < responseData.total_pages;
            console.log(`Total de páginas: ${totalPages}, Página actual: ${page}, Hay más páginas: ${hasMorePages}`);
          } else if (responseData.has_more !== undefined) {
            hasMorePages = responseData.has_more;
            console.log(`Hay más páginas (has_more): ${hasMorePages}`);
          } else {
            // Si no hay información de paginación, continuar si hay resultados
            hasMorePages = responseData.results.length > 0;
            console.log(`Sin info de paginación, continuar si hay resultados: ${hasMorePages}`);
          }
        } else {
          // Respuesta inesperada
          console.warn('Formato de respuesta inesperado:', responseData);
          hasMorePages = false;
        }

        page++;
        
        // Pequeño delay entre páginas para evitar rate limiting
        if (hasMorePages) {
          await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
        }
        
        // Prevenir bucle infinito
        if (page > 100) {
          console.warn('Límite de páginas alcanzado (100), deteniendo...');
          break;
        }
      }

      console.log(`Total de customers obtenidos de todas las páginas: ${allCustomers.length}`);
      return allCustomers;
    };

    // Obtener todos los customers paginados
    const allCustomers = await getAllCustomers();
    console.log(`Total de customers obtenidos: ${allCustomers.length}`);

    // No filtrar por tipo - incluir todos los terceros
    const allThirdParties = allCustomers;

    console.log(`Se encontraron ${allThirdParties.length} terceros en Siigo (todos los tipos)`);

    if (allThirdParties.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No se encontraron terceros para migrar',
        data: {
          totalFound: 0,
          migrated: 0,
          skipped: 0,
          errors: 0
        }
      });
    }

    // Procesar y migrar cada tercero
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    console.log(`Iniciando procesamiento de ${allThirdParties.length} terceros...`);

    for (let i = 0; i < allThirdParties.length; i++) {
      const thirdParty = allThirdParties[i];
      console.log(`Procesando tercero ${i + 1}/${allThirdParties.length}: ${thirdParty.id}`);
      
      try {
        // Verificar si ya existe un proveedor con este siigoId
        const existingProvider = await (prisma as any).provider.findUnique({
          where: { siigoId: thirdParty.id }
        });

        if (existingProvider) {
          console.log(`Tercero ${thirdParty.id} ya existe, saltando...`);
          skippedCount++;
          continue;
        }

        // Mapear datos de Siigo a nuestro modelo
        const providerData = {
          siigoId: thirdParty.id,
          type: thirdParty.type || 'Customer',
          personType: thirdParty.person_type || 'Person',
          idTypeCode: thirdParty.id_type?.code || '',
          idTypeName: thirdParty.id_type?.name || '',
          identification: thirdParty.identification || '',
          name: Array.isArray(thirdParty.name) 
            ? thirdParty.name.join(' ') 
            : thirdParty.name || '',
          active: thirdParty.active !== false, // Default true si no está definido
          isMigrated: true,
          migrationDate: new Date(),
          createdBy: 'system' // Podrías obtener esto del contexto de autenticación
        };

        console.log(`Datos mapeados para ${thirdParty.id}:`, {
          siigoId: providerData.siigoId,
          type: providerData.type,
          identification: providerData.identification,
          name: providerData.name
        });

        // Validar datos requeridos
        if (!providerData.siigoId || !providerData.identification || !providerData.name) {
          console.warn(`Tercero ${thirdParty.id} tiene datos incompletos:`, {
            siigoId: providerData.siigoId,
            identification: providerData.identification,
            name: providerData.name
          });
          skippedCount++;
          continue;
        }

        // Crear el proveedor en la base de datos
        const createdProvider = await (prisma as any).provider.create({
          data: providerData
        });

        console.log(`✅ Tercero migrado exitosamente: ${providerData.name} (${providerData.identification}) - ID: ${createdProvider.id}`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Error migrando tercero ${thirdParty.id}:`, error);
        console.error(`Datos del tercero:`, thirdParty);
        errorCount++;
        errors.push(`Error con tercero ${thirdParty.id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    console.log(`Migración completada: ${migratedCount} migrados, ${skippedCount} saltados, ${errorCount} errores`);

    return NextResponse.json({
      success: true,
      message: `Migración completada: ${migratedCount} terceros migrados exitosamente`,
      data: {
        totalFound: allThirdParties.length,
        migrated: migratedCount,
        skipped: skippedCount,
        errors: errorCount,
        errorDetails: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('Error en migración de terceros:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor durante la migración',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
