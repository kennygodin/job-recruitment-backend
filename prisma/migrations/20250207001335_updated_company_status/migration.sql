/*
  Warnings:

  - You are about to drop the column `businessStatus` on the `Company` table. All the data in the column will be lost.
  - Added the required column `companyStatus` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "businessStatus",
ADD COLUMN     "companyStatus" "CompanyStatus" NOT NULL;

-- DropEnum
DROP TYPE "BusinessStatus";
