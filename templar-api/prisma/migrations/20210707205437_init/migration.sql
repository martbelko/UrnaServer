/*
  Warnings:

  - Changed the type of `type` on the `Ban` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BanType" AS ENUM ('NONE', 'NORMAL', 'CT', 'SILENCE');

-- AlterTable
ALTER TABLE "Ban" DROP COLUMN "type",
ADD COLUMN     "type" "BanType" NOT NULL;
