/*
  Warnings:

  - You are about to drop the column `targetName` on the `Ban` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `PlayerInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.

*/
-- AlterTable
ALTER TABLE "Ban" DROP COLUMN "targetName";

-- AlterTable
ALTER TABLE "PlayerInfo" ALTER COLUMN "name" SET DATA TYPE VARCHAR(128);
