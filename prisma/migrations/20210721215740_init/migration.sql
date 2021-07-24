/*
  Warnings:

  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `passwordID` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `Admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_passwordID_fkey";

-- DropIndex
DROP INDEX "Admin.email_unique";

-- DropIndex
DROP INDEX "Admin.name_unique";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "passwordID",
DROP COLUMN "salt",
ADD COLUMN     "userID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordID" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.name_unique" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.passwordID_unique" ON "User"("passwordID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin.userID_unique" ON "Admin"("userID");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("passwordID") REFERENCES "Password"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
