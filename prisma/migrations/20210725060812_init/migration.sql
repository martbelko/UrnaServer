/*
  Warnings:

  - A unique constraint covering the columns `[targetInfoID]` on the table `Ban` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[banID]` on the table `Unban` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `immunity` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banID` to the `Unban` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ban" DROP CONSTRAINT "Ban_unbanID_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "immunity" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Unban" ADD COLUMN     "banID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ban_targetInfoID_unique" ON "Ban"("targetInfoID");

-- CreateIndex
CREATE UNIQUE INDEX "Unban.banID_unique" ON "Unban"("banID");

-- AddForeignKey
ALTER TABLE "Unban" ADD FOREIGN KEY ("banID") REFERENCES "Ban"("id") ON DELETE CASCADE ON UPDATE CASCADE;
