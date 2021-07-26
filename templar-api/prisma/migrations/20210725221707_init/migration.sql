/*
  Warnings:

  - Added the required column `email` to the `Vip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "VipMode" ADD VALUE 'NONE';

-- AlterTable
ALTER TABLE "Vip" ADD COLUMN     "email" TEXT NOT NULL;
