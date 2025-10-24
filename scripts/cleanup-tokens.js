#!/usr/bin/env node

/**
 * Script para limpiar tokens de acceso antiguos
 * Se puede ejecutar como tarea programada (cron job) para mantener la base de datos limpia
 * 
 * Uso:
 * node scripts/cleanup-tokens.js
 * 
 * O programar con cron:
 * 0 2 * * * cd /path/to/project && node scripts/cleanup-tokens.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupOldTokens() {
  try {
    console.log('Iniciando limpieza de tokens antiguos...');
    
    const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    
    const result = await prisma.accessToken.deleteMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo
        }
      }
    });

    console.log(`Limpieza completada: ${result.count} tokens eliminados`);
    
    // Obtener estadísticas actuales
    const totalTokens = await prisma.accessToken.count();
    const validTokens = await prisma.accessToken.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - (24 * 60 * 60 * 1000))
        }
      }
    });

    console.log(`Estadísticas actuales:`);
    console.log(`   - Total de tokens: ${totalTokens}`);
    console.log(`   - Tokens válidos (últimas 24h): ${validTokens}`);
    console.log(`   - Tokens antiguos: ${totalTokens - validTokens}`);

  } catch (error) {
    console.error('Error durante la limpieza:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  cleanupOldTokens()
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { cleanupOldTokens };
