-- AlterTable
ALTER TABLE "public"."scraped_documents" ADD COLUMN     "extractedFiles" TEXT,
ADD COLUMN     "extractedFilesCount" INTEGER;
