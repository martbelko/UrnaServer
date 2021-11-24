-- CreateEnum
CREATE TYPE "VipMode" AS ENUM ('NORMAL', 'EXTRA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "steamID" TEXT NOT NULL,
    "emailID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresIn" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "csFlags" INTEGER NOT NULL,
    "webFlags" INTEGER NOT NULL,
    "dcFlags" INTEGER NOT NULL,
    "immunity" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanInfo" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "steam2ID" VARCHAR(32) NOT NULL,
    "steam3ID" VARCHAR(32) NOT NULL,
    "steamID64" VARCHAR(32) NOT NULL,
    "ip" VARCHAR(32) NOT NULL,

    CONSTRAINT "BanInfo_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unban" (
    "id" SERIAL NOT NULL,
    "adminID" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "banID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vip" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "steamid" VARCHAR(32) NOT NULL,
    "vipMode" "VipMode" NOT NULL,

    CONSTRAINT "Vip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_steamID_key" ON "User"("steamID");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailID_key" ON "User"("emailID");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_key" ON "Email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Server_ip_key" ON "Server"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userID_key" ON "Admin"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Ban_banInfoID_key" ON "Ban"("banInfoID");

-- CreateIndex
CREATE UNIQUE INDEX "Ban_unbanID_key" ON "Ban"("unbanID");

-- CreateIndex
CREATE UNIQUE INDEX "Unban_banID_key" ON "Unban"("banID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_emailID_fkey" FOREIGN KEY ("emailID") REFERENCES "Email"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_banInfoID_fkey" FOREIGN KEY ("banInfoID") REFERENCES "BanInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unban" ADD CONSTRAINT "Unban_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unban" ADD CONSTRAINT "Unban_banID_fkey" FOREIGN KEY ("banID") REFERENCES "Ban"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vip" ADD CONSTRAINT "Vip_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
