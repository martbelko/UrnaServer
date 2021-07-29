/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailID` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User.email_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "emailID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "VerifiedEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifiedEmail.email_unique" ON "VerifiedEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.emailID_unique" ON "User"("emailID");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("emailID") REFERENCES "VerifiedEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
