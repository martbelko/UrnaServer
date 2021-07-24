/*
  Warnings:

  - The `salt` column on the `Password` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `password` column on the `Password` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "salt",
ADD COLUMN     "salt" INTEGER[],
DROP COLUMN "password",
ADD COLUMN     "password" INTEGER[];
