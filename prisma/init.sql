-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Esta migración será generada automáticamente por Prisma
-- Al ejecutar: npx prisma migrate dev --name init

-- Los modelos definidos en schema.prisma se crearán automáticamente:
-- - companies (empresas)
-- - invoices (facturas)  
-- - scraping_logs (logs de scraping)

-- Índices adicionales para optimizar consultas
-- Estos se pueden agregar después de la migración inicial

-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_company_date 
-- ON invoices(company_id, issue_date DESC);

-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_status 
-- ON invoices(status);

-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_supplier_nit 
-- ON invoices(supplier_nit);

-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraping_logs_company_date 
-- ON scraping_logs(company_nit, created_at DESC);
