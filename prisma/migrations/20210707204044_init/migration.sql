/*
  Warnings:

  - You are about to drop the column `playerInfoID` on the `Ban` table. All the data in the column will be lost.
  - Added the required column `targetInfoID` to the `Ban` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ban" DROP CONSTRAINT "Ban_playerInfoID_fkey";

-- AlterTable
ALTER TABLE "Ban" DROP COLUMN "playerInfoID",
ADD COLUMN     "targetInfoID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("targetInfoID") REFERENCES "PlayerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
