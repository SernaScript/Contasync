#!/usr/bin/env node

/**
 * Script de inicialización para la integración de base de datos
 * Ejecuta todas las tareas necesarias para configurar Prisma + Supabase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando configuración de base de datos...\n');

// Función para ejecutar comandos
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en: ${description}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Función para verificar archivos
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} encontrado`);
    return true;
  } else {
    console.log(`⚠️  ${description} no encontrado`);
    return false;
  }
}

// 1. Verificar archivos necesarios
console.log('🔍 Verificando archivos necesarios...');
checkFile('prisma/schema.prisma', 'Schema de Prisma');
checkFile('.env', 'Archivo de variables de entorno');
checkFile('src/lib/prisma.ts', 'Cliente de Prisma');
checkFile('src/lib/ExcelProcessor.ts', 'Procesador de Excel');
console.log('');

// 2. Verificar variables de entorno
console.log('🔧 Verificando configuración...');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurada en .env');
  console.log('Por favor, configura tu connection string de Supabase en .env');
  console.log('Ejemplo: DATABASE_URL="postgresql://user:pass@host:port/db?schema=public"');
  process.exit(1);
}
console.log('✅ Variables de entorno configuradas\n');

// 3. Instalar dependencias si es necesario
runCommand('npm install', 'Verificando dependencias');

// 4. Generar cliente de Prisma
runCommand('npx prisma generate', 'Generando cliente de Prisma');

// 5. Aplicar migraciones (opcional, requiere confirmación)
console.log('🗄️ ¿Deseas aplicar las migraciones a la base de datos?');
console.log('Esto creará las tablas en Supabase.');
console.log('Presiona Ctrl+C para cancelar o cualquier tecla para continuar...');

// Esperar entrada del usuario
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  console.log('\n');
  
  try {
    runCommand('npx prisma migrate dev --name init', 'Aplicando migraciones');
  } catch (error) {
    console.log('ℹ️  Las migraciones no se pudieron aplicar automáticamente.');
    console.log('Esto es normal si ya existen o si hay problemas de conexión.');
    console.log('Puedes aplicarlas manualmente más tarde con: npx prisma migrate dev');
  }
  
  // 6. Mostrar resumen final
  console.log('🎉 ¡Configuración completada!\n');
  console.log('📋 Próximos pasos:');
  console.log('1. Verifica tu conexión a Supabase: npx prisma studio');
  console.log('2. Ejecuta el proyecto: npm run dev');
  console.log('3. Ve a /automatizacion-f2x y activa "Procesar a BD"');
  console.log('4. Ve a /base-datos para consultar los datos');
  console.log('\n📖 Documentación completa en: DATABASE_INTEGRATION.md');
  
  process.exit(0);
});
