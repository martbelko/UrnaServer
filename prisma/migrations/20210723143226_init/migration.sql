/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `dateTime` on the `Ban` table. All the data in the column will be lost.
  - You are about to drop the column `dateTime` on the `Unban` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unbanID]` on the table `Ban` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PlayerInfo.ip_unique";

-- DropIndex
DROP INDEX "PlayerInfo.steam2ID_unique";

-- DropIndex
DROP INDEX "PlayerInfo.steam3ID_unique";

-- DropIndex
DROP INDEX "PlayerInfo.steamID64_unique";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Ban" DROP COLUMN "dateTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Unban" DROP COLUMN "dateTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ban.unbanID_unique" ON "Ban"("unbanID");
