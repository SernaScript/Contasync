-- CreateTable
CREATE TABLE "public"."siigo_credentials" (
    "id" TEXT NOT NULL,
    "apiUser" TEXT NOT NULL,
    "accessKey" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL DEFAULT 'production',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siigo_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scraped_documents" (
    "id" TEXT NOT NULL,
    "reception" TEXT,
    "documentDate" TEXT,
    "prefix" TEXT,
    "documentNumber" TEXT,
    "documentType" TEXT,
    "senderNit" TEXT,
    "senderName" TEXT,
    "receiverNit" TEXT,
    "receiverName" TEXT,
    "result" TEXT,
    "radianStatus" TEXT,
    "totalValue" TEXT,
    "isDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "downloadPath" TEXT,
    "downloadDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraped_documents_pkey" PRIMARY KEY ("id")
);
