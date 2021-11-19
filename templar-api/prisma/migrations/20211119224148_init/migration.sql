/*
  Warnings:

  - You are about to drop the column `flags` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the `VerifiedEmail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `csFlags` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dcFlags` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webFlags` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_emailID_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "flags",
ADD COLUMN     "csFlags" INTEGER NOT NULL,
ADD COLUMN     "dcFlags" INTEGER NOT NULL,
ADD COLUMN     "webFlags" INTEGER NOT NULL;

-- DropTable
DROP TABLE "VerifiedEmail";

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email.email_unique" ON "Email"("email");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("emailID") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;
