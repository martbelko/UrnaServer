-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product.description_unique" ON "Product"("description");
