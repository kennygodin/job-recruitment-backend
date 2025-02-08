/*
  Warnings:

  - You are about to drop the column `companyId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Job` table. All the data in the column will be lost.
  - Added the required column `jobCompanyId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobDescription` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobExperience` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobLocation` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobSalary` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Made the column `jobRequirements` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jobSummary` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "companyId",
DROP COLUMN "description",
DROP COLUMN "experience",
DROP COLUMN "industry",
DROP COLUMN "location",
DROP COLUMN "salary",
DROP COLUMN "title",
ADD COLUMN     "jobCompanyId" TEXT NOT NULL,
ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "jobExperience" TEXT NOT NULL,
ADD COLUMN     "jobLocation" TEXT NOT NULL,
ADD COLUMN     "jobSalary" TEXT NOT NULL,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ALTER COLUMN "jobRequirements" SET NOT NULL,
ALTER COLUMN "jobSummary" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_jobCompanyId_fkey" FOREIGN KEY ("jobCompanyId") REFERENCES "Company"("companyId") ON DELETE CASCADE ON UPDATE CASCADE;
