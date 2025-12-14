/*
  Warnings:

  - You are about to drop the `ArtistaLanzaÁlbum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GrupoLanzaÁlbum` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ArtistaLanzaÁlbum" DROP CONSTRAINT "ArtistaLanzaÁlbum_idAlb_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArtistaLanzaÁlbum" DROP CONSTRAINT "ArtistaLanzaÁlbum_idAp_idGr_fkey";

-- DropForeignKey
ALTER TABLE "public"."GrupoLanzaÁlbum" DROP CONSTRAINT "GrupoLanzaÁlbum_idAlb_fkey";

-- DropForeignKey
ALTER TABLE "public"."GrupoLanzaÁlbum" DROP CONSTRAINT "GrupoLanzaÁlbum_idGr_fkey";

-- DropTable
DROP TABLE "public"."ArtistaLanzaÁlbum";

-- DropTable
DROP TABLE "public"."GrupoLanzaÁlbum";

-- CreateTable
CREATE TABLE "public"."ArtistaLanzaAlbum" (
    "idAp" INTEGER NOT NULL,
    "idGr" INTEGER NOT NULL,
    "idAlb" INTEGER NOT NULL,

    CONSTRAINT "ArtistaLanzaAlbum_pkey" PRIMARY KEY ("idAp","idGr","idAlb")
);

-- CreateTable
CREATE TABLE "public"."GrupoLanzaAlbum" (
    "idGr" INTEGER NOT NULL,
    "idAlb" INTEGER NOT NULL,

    CONSTRAINT "GrupoLanzaAlbum_pkey" PRIMARY KEY ("idGr","idAlb")
);

-- AddForeignKey
ALTER TABLE "public"."ArtistaLanzaAlbum" ADD CONSTRAINT "ArtistaLanzaAlbum_idAp_idGr_fkey" FOREIGN KEY ("idAp", "idGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaLanzaAlbum" ADD CONSTRAINT "ArtistaLanzaAlbum_idAlb_fkey" FOREIGN KEY ("idAlb") REFERENCES "public"."Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoLanzaAlbum" ADD CONSTRAINT "GrupoLanzaAlbum_idGr_fkey" FOREIGN KEY ("idGr") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoLanzaAlbum" ADD CONSTRAINT "GrupoLanzaAlbum_idAlb_fkey" FOREIGN KEY ("idAlb") REFERENCES "public"."Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
