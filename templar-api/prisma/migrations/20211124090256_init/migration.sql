/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `steamid` on the `Vip` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `Vip` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Server` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverType` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Vip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServerType" AS ENUM ('JAILBREAK');

-- DropForeignKey
ALTER TABLE "Vip" DROP CONSTRAINT "Vip_userid_fkey";

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "nickname" VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "serverType" "ServerType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Vip" DROP COLUMN "steamid",
DROP COLUMN "userid",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_nickname_key" ON "Admin"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Server_name_key" ON "Server"("name");

-- AddForeignKey
ALTER TABLE "Vip" ADD CONSTRAINT "Vip_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
