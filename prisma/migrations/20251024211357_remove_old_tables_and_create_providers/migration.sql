/*
  Warnings:

  - You are about to drop the column `thirdPartyId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `identificationTypeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userIdentificationNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `identification_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `third_parties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `providerId` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."invoices" DROP CONSTRAINT "invoices_thirdPartyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."third_parties" DROP CONSTRAINT "third_parties_identificationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_identificationTypeId_fkey";

-- AlterTable
ALTER TABLE "public"."invoices" DROP COLUMN "thirdPartyId",
ADD COLUMN     "providerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "identificationTypeId",
DROP COLUMN "userIdentificationNumber";

-- DropTable
DROP TABLE "public"."identification_types";

-- DropTable
DROP TABLE "public"."third_parties";

-- CreateTable
CREATE TABLE "public"."providers" (
    "id" TEXT NOT NULL,
    "siigoId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "personType" TEXT NOT NULL,
    "idTypeCode" TEXT NOT NULL,
    "idTypeName" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isMigrated" BOOLEAN NOT NULL DEFAULT false,
    "migrationDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_siigoId_key" ON "public"."providers"("siigoId");

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
