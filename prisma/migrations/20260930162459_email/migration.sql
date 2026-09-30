/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `palestrante` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "palestrante_email_key" ON "palestrante"("email");
