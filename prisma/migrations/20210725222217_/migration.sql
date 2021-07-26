/*
  Warnings:

  - The values [NONE] on the enum `VipMode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VipMode_new" AS ENUM ('CLASSIC', 'EXTRA');
ALTER TABLE "Vip" ALTER COLUMN "vipMode" TYPE "VipMode_new" USING ("vipMode"::text::"VipMode_new");
ALTER TYPE "VipMode" RENAME TO "VipMode_old";
ALTER TYPE "VipMode_new" RENAME TO "VipMode";
DROP TYPE "VipMode_old";
COMMIT;
