/*
  Warnings:

  - You are about to drop the column `userId` on the `Application` table. All the data in the column will be lost.
  - Added the required column `appliedById` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsOfExperience` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "userId",
ADD COLUMN     "appliedById" TEXT NOT NULL,
ADD COLUMN     "yearsOfExperience" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_appliedById_fkey" FOREIGN KEY ("appliedById") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
