/*
  Warnings:

  - The values [NONE] on the enum `BanType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `discordName` on the `Vip` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Vip` table. All the data in the column will be lost.
  - Added the required column `userid` to the `Vip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BanType_new" AS ENUM ('NORMAL', 'CT', 'GAG', 'MUTE');
ALTER TABLE "Ban" ALTER COLUMN "type" TYPE "BanType_new" USING ("type"::text::"BanType_new");
ALTER TYPE "BanType" RENAME TO "BanType_old";
ALTER TYPE "BanType_new" RENAME TO "BanType";
DROP TYPE "BanType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Vip" DROP COLUMN "discordName",
DROP COLUMN "email",
ADD COLUMN     "userid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vip" ADD FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
