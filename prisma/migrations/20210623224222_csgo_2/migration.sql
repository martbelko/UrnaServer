-- AlterTable
ALTER TABLE "Ban" ADD COLUMN     "serverName" TEXT,
ADD COLUMN     "unbanID" INTEGER,
ALTER COLUMN "reason" DROP NOT NULL,
ALTER COLUMN "reason" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Unban" (
    "id" SERIAL NOT NULL,
    "adminID" INTEGER NOT NULL,
    "reason" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ban" ADD FOREIGN KEY ("unbanID") REFERENCES "Unban"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unban" ADD FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
