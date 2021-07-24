/*
  Warnings:

  - Added the required column `salt` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "salt" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Password" (
    "id" SERIAL NOT NULL,
    "salt" INTEGER[],

    PRIMARY KEY ("id")
);
