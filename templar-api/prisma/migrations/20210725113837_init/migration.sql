/*
  Warnings:

  - You are about to drop the column `adminCreatorID` on the `Admin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_adminCreatorID_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "adminCreatorID";