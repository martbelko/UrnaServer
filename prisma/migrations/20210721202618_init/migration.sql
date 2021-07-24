/*
  Warnings:

  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `passwordID` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "password",
ADD COLUMN     "passwordID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Password" ADD COLUMN     "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Admin" ADD FOREIGN KEY ("passwordID") REFERENCES "Password"("id") ON DELETE CASCADE ON UPDATE CASCADE;
