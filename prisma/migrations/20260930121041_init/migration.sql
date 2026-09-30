-- CreateTable
CREATE TABLE "evento" (
    "id_evento" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "data" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "palestrante" (
    "id_palestrante" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "evento_palestrante" (
    "id_evento" INTEGER NOT NULL,
    "id_palestrante" INTEGER NOT NULL,

    PRIMARY KEY ("id_evento", "id_palestrante"),
    CONSTRAINT "evento_palestrante_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "evento" ("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "evento_palestrante_id_palestrante_fkey" FOREIGN KEY ("id_palestrante") REFERENCES "palestrante" ("id_palestrante") ON DELETE RESTRICT ON UPDATE CASCADE
);
