/*
  Warnings:

  - You are about to drop the column `infoID` on the `Ban` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Ban` table. All the data in the column will be lost.
  - You are about to drop the column `serverName` on the `Ban` table. All the data in the column will be lost.
  - Added the required column `playerInfoID` to the `Ban` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetName` to the `Ban` table without a default value. This is not possible if the table is not empty.
  - Made the column `reason` on table `Ban` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reason` on table `Unban` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Ban" DROP CONSTRAINT "Ban_infoID_fkey";

-- AlterTable
ALTER TABLE "Ban" DROP COLUMN "infoID",
DROP COLUMN "name",
DROP COLUMN "serverName",
ADD COLUMN     "playerInfoID" INTEGER NOT NULL,
ADD COLUMN     "serverID" INTEGER,
ADD COLUMN     "targetName" VARCHAR(128) NOT NULL,
ALTER COLUMN "reason" SET NOT NULL;

-- AlterTable
ALTER TABLE "Unban" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "reason" SET NOT NULL;

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server.ip_unique" ON "Server"("ip");

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("playerInfoID") REFERENCES "PlayerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("serverID") REFERENCES "Server"("id") ON DELETE SET NULL ON UPDATE CASCADE;
