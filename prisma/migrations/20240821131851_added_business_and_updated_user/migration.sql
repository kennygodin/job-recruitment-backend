/*
  Warnings:

  - You are about to drop the column `companyAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `companyWebsite` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyAddress",
DROP COLUMN "companyName",
DROP COLUMN "companyWebsite",
ADD COLUMN     "positionInCompany" TEXT;

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "businessId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyWebsite" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "numberOfEmployees" INTEGER NOT NULL,
    "industry" TEXT NOT NULL,
    "typeOfEmployer" TEXT NOT NULL,
    "whereDidYouHear" TEXT NOT NULL,
    "notificationEmail" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessId_key" ON "Business"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_userId_key" ON "Business"("userId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
