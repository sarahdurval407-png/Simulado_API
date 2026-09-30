/*
  Warnings:

  - You are about to drop the column `data` on the `evento` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_evento" (
    "id_evento" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "local" TEXT NOT NULL
);
INSERT INTO "new_evento" ("descricao", "id_evento", "local", "nome") SELECT "descricao", "id_evento", "local", "nome" FROM "evento";
DROP TABLE "evento";
ALTER TABLE "new_evento" RENAME TO "evento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
