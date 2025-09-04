/*
  Warnings:

  - You are about to drop the column `companyId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `documentType` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `issueDate` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `observations` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `scrapedAt` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `sourceFile` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `supplierName` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `supplierNit` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scraping_logs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `invoiceDate` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoicePrefix` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirdPartyId` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."invoices" DROP CONSTRAINT "invoices_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."invoices" DROP COLUMN "companyId",
DROP COLUMN "description",
DROP COLUMN "documentType",
DROP COLUMN "dueDate",
DROP COLUMN "issueDate",
DROP COLUMN "observations",
DROP COLUMN "scrapedAt",
DROP COLUMN "sourceFile",
DROP COLUMN "status",
DROP COLUMN "subtotal",
DROP COLUMN "supplierName",
DROP COLUMN "supplierNit",
DROP COLUMN "tax",
DROP COLUMN "total",
ADD COLUMN     "invoiceCufe" TEXT,
ADD COLUMN     "invoiceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invoicePrefix" TEXT NOT NULL,
ADD COLUMN     "invoiceState" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "thirdPartyId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "identificationTypeId" TEXT,
ADD COLUMN     "userIdentificationNumber" TEXT;

-- DropTable
DROP TABLE "public"."companies";

-- DropTable
DROP TABLE "public"."scraping_logs";

-- CreateTable
CREATE TABLE "public"."identification_types" (
    "id" TEXT NOT NULL,
    "identificationTypeName" TEXT NOT NULL,
    "identificationTypeEntity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identification_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."third_parties" (
    "id" TEXT NOT NULL,
    "thirdPartyName" TEXT NOT NULL,
    "thirdPartyIdentification" TEXT NOT NULL,
    "thirdPartyStatus" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "identificationTypeId" TEXT NOT NULL,

    CONSTRAINT "third_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice_products" (
    "id" TEXT NOT NULL,
    "invoiceProductName" TEXT NOT NULL,
    "productQuantity" DOUBLE PRECISION NOT NULL,
    "productPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "taxId" TEXT,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "invoice_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."taxes" (
    "id" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxName" TEXT NOT NULL,
    "taxPercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."warehouses" (
    "id" TEXT NOT NULL,
    "warehouseName" TEXT NOT NULL,
    "warehouseActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."api_responses" (
    "id" TEXT NOT NULL,
    "apiResponseDate" TIMESTAMP(3) NOT NULL,
    "apiResponseJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" TEXT,

    CONSTRAINT "api_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_identificationTypeId_fkey" FOREIGN KEY ("identificationTypeId") REFERENCES "public"."identification_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."third_parties" ADD CONSTRAINT "third_parties_identificationTypeId_fkey" FOREIGN KEY ("identificationTypeId") REFERENCES "public"."identification_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_thirdPartyId_fkey" FOREIGN KEY ("thirdPartyId") REFERENCES "public"."third_parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_products" ADD CONSTRAINT "invoice_products_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_products" ADD CONSTRAINT "invoice_products_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "public"."taxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_products" ADD CONSTRAINT "invoice_products_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."api_responses" ADD CONSTRAINT "api_responses_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
