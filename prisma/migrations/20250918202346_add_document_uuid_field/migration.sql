/*
  Warnings:

  - A unique constraint covering the columns `[documentUUID]` on the table `scraped_documents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentUUID` to the `scraped_documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."scraped_documents" ADD COLUMN     "documentUUID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "scraped_documents_documentUUID_key" ON "public"."scraped_documents"("documentUUID");
