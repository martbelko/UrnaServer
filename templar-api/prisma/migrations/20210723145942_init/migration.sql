/*
  Warnings:

  - The values [SILENCE] on the enum `BanType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BanType_new" AS ENUM ('NONE', 'NORMAL', 'CT', 'GAG', 'MUTE');
ALTER TABLE "Ban" ALTER COLUMN "type" TYPE "BanType_new" USING ("type"::text::"BanType_new");
ALTER TYPE "BanType" RENAME TO "BanType_old";
ALTER TYPE "BanType_new" RENAME TO "BanType";
DROP TYPE "BanType_old";
COMMIT;
