/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RefreshToken` table. All the data in the column will be lost.
  - The primary key for the `ResetToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `ResetToken` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `ResetToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ResetToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `ResetToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `ResetToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires` to the `ResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_userId_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RefreshToken_id_seq";

-- AlterTable
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ResetToken_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_email_key" ON "RefreshToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_email_key" ON "ResetToken"("email");
