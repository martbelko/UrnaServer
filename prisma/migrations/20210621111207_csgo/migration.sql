/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "steamID" VARCHAR(32) NOT NULL,
    "name" TEXT NOT NULL,
    "flags" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerInfo" (
    "id" SERIAL NOT NULL,
    "steam2ID" VARCHAR(32) NOT NULL,
    "steam3ID" VARCHAR(32) NOT NULL,
    "steamID64" VARCHAR(32) NOT NULL,
    "ip" VARCHAR(32) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "adminID" INTEGER NOT NULL,
    "infoID" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" VARCHAR(32) NOT NULL,
    "type" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin.steamID_unique" ON "Admin"("steamID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin.name_unique" ON "Admin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerInfo.steam2ID_unique" ON "PlayerInfo"("steam2ID");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerInfo.steam3ID_unique" ON "PlayerInfo"("steam3ID");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerInfo.steamID64_unique" ON "PlayerInfo"("steamID64");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerInfo.ip_unique" ON "PlayerInfo"("ip");

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("infoID") REFERENCES "PlayerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
