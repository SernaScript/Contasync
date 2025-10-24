-- CreateTable
CREATE TABLE "public"."access_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "siigoCredentialsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounting_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."excluded_third_parties" (
    "id" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountingRuleId" TEXT NOT NULL,

    CONSTRAINT "excluded_third_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."provider_account_mappings" (
    "id" TEXT NOT NULL,
    "providerNit" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accountingAccount" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountingRuleId" TEXT NOT NULL,

    CONSTRAINT "provider_account_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cost_centers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_centers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_token_key" ON "public"."access_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_rules_name_key" ON "public"."accounting_rules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "excluded_third_parties_nit_key" ON "public"."excluded_third_parties"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "provider_account_mappings_providerNit_accountingRuleId_key" ON "public"."provider_account_mappings"("providerNit", "accountingRuleId");

-- CreateIndex
CREATE UNIQUE INDEX "cost_centers_code_key" ON "public"."cost_centers"("code");

-- AddForeignKey
ALTER TABLE "public"."access_tokens" ADD CONSTRAINT "access_tokens_siigoCredentialsId_fkey" FOREIGN KEY ("siigoCredentialsId") REFERENCES "public"."siigo_credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."excluded_third_parties" ADD CONSTRAINT "excluded_third_parties_accountingRuleId_fkey" FOREIGN KEY ("accountingRuleId") REFERENCES "public"."accounting_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_account_mappings" ADD CONSTRAINT "provider_account_mappings_accountingRuleId_fkey" FOREIGN KEY ("accountingRuleId") REFERENCES "public"."accounting_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
