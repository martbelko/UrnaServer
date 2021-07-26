/*
  Warnings:

  - Added the required column `adminCreatorID` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "adminCreatorID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Admin" ADD FOREIGN KEY ("adminCreatorID") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
