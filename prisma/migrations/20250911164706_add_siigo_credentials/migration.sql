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
