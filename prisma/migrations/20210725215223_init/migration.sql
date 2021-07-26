-- CreateEnum
CREATE TYPE "VipMode" AS ENUM ('CLASSIC', 'EXTRA');

-- CreateTable
CREATE TABLE "Vip" (
    "id" SERIAL NOT NULL,
    "steamid" VARCHAR(32) NOT NULL,
    "vipMode" "VipMode" NOT NULL,
    "discordName" TEXT,

    PRIMARY KEY ("id")
);
