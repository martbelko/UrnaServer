-- CreateEnum
CREATE TYPE "VipMode" AS ENUM ('NORMAL', 'EXTRA');

-- CreateEnum
CREATE TYPE "ServerType" AS ENUM ('JAILBREAK');

-- CreateTable
CREATE TABLE "IP" (
    "id" SERIAL NOT NULL,
    "ip" VARCHAR(16) NOT NULL,

    CONSTRAINT "IP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
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
    "serverType" "ServerType" NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nickname" VARCHAR(32) NOT NULL,
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
CREATE TABLE "PrimaryBan" (
    "id" SERIAL NOT NULL,
    "targetUserID" INTEGER NOT NULL,
    "adminID" INTEGER NOT NULL,
    "unbanID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "serverID" INTEGER,

    CONSTRAINT "PrimaryBan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondaryBan" (
    "id" SERIAL NOT NULL,
    "primaryBanID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "SecondaryBan_pkey" PRIMARY KEY ("id")
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
    "userID" INTEGER NOT NULL,
    "vipMode" "VipMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IPToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

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
CREATE UNIQUE INDEX "Server_name_key" ON "Server"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_nickname_key" ON "Admin"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userID_key" ON "Admin"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "PrimaryBan_unbanID_key" ON "PrimaryBan"("unbanID");

-- CreateIndex
CREATE UNIQUE INDEX "Unban_banID_key" ON "Unban"("banID");

-- CreateIndex
CREATE UNIQUE INDEX "_IPToUser_AB_unique" ON "_IPToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_IPToUser_B_index" ON "_IPToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_emailID_fkey" FOREIGN KEY ("emailID") REFERENCES "Email"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrimaryBan" ADD CONSTRAINT "PrimaryBan_targetUserID_fkey" FOREIGN KEY ("targetUserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrimaryBan" ADD CONSTRAINT "PrimaryBan_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrimaryBan" ADD CONSTRAINT "PrimaryBan_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "Server"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondaryBan" ADD CONSTRAINT "SecondaryBan_primaryBanID_fkey" FOREIGN KEY ("primaryBanID") REFERENCES "PrimaryBan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondaryBan" ADD CONSTRAINT "SecondaryBan_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unban" ADD CONSTRAINT "Unban_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unban" ADD CONSTRAINT "Unban_banID_fkey" FOREIGN KEY ("banID") REFERENCES "PrimaryBan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vip" ADD CONSTRAINT "Vip_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IPToUser" ADD FOREIGN KEY ("A") REFERENCES "IP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IPToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
