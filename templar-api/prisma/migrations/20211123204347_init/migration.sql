-- CreateEnum
CREATE TYPE "VipMode" AS ENUM ('NORMAL', 'EXTRA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "emailID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresIn" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "steamID" VARCHAR(32) NOT NULL,
    "csFlags" INTEGER NOT NULL,
    "webFlags" INTEGER NOT NULL,
    "dcFlags" INTEGER NOT NULL,
    "immunity" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanInfo" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "steam2ID" VARCHAR(32) NOT NULL,
    "steam3ID" VARCHAR(32) NOT NULL,
    "steamID64" VARCHAR(32) NOT NULL,
    "ip" VARCHAR(32) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" SERIAL NOT NULL,
    "adminID" INTEGER NOT NULL,
    "banInfoID" INTEGER NOT NULL,
    "unbanID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "serverID" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unban" (
    "id" SERIAL NOT NULL,
    "adminID" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "banID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vip" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "steamid" VARCHAR(32) NOT NULL,
    "vipMode" "VipMode" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.name_unique" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User.emailID_unique" ON "User"("emailID");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken.token_unique" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Email.email_unique" ON "Email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Server.ip_unique" ON "Server"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "Admin.steamID_unique" ON "Admin"("steamID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin.userID_unique" ON "Admin"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Ban.banInfoID_unique" ON "Ban"("banInfoID");

-- CreateIndex
CREATE UNIQUE INDEX "Ban.unbanID_unique" ON "Ban"("unbanID");

-- CreateIndex
CREATE UNIQUE INDEX "Unban.banID_unique" ON "Unban"("banID");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("emailID") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("banInfoID") REFERENCES "BanInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("serverID") REFERENCES "Server"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unban" ADD FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unban" ADD FOREIGN KEY ("banID") REFERENCES "Ban"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vip" ADD FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
