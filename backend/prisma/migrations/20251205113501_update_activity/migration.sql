/*
  Warnings:

  - You are about to drop the `ArtistaEnActividad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GrupoEnActividad` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ArtistaEnActividad" DROP CONSTRAINT "ArtistaEnActividad_idAct_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArtistaEnActividad" DROP CONSTRAINT "ArtistaEnActividad_idAp_idGr_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArtistaEnActividad" DROP CONSTRAINT "ArtistaEnActividad_idGrupos_fkey";

-- DropForeignKey
ALTER TABLE "public"."GrupoEnActividad" DROP CONSTRAINT "GrupoEnActividad_idAct_fkey";

-- DropTable
DROP TABLE "public"."ArtistaEnActividad";

-- DropTable
DROP TABLE "public"."GrupoEnActividad";

-- CreateTable
CREATE TABLE "public"."PersonasEnActividad" (
    "idAp" INTEGER NOT NULL,
    "idGr" INTEGER NOT NULL,
    "idAct" INTEGER NOT NULL,
    "idGrupos" INTEGER NOT NULL,
    "aceptado" BOOLEAN NOT NULL,

    CONSTRAINT "PersonasEnActividad_pkey" PRIMARY KEY ("idAp","idGr","idAct")
);

-- AddForeignKey
ALTER TABLE "public"."PersonasEnActividad" ADD CONSTRAINT "PersonasEnActividad_idAp_idGr_fkey" FOREIGN KEY ("idAp", "idGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PersonasEnActividad" ADD CONSTRAINT "PersonasEnActividad_idAct_fkey" FOREIGN KEY ("idAct") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PersonasEnActividad" ADD CONSTRAINT "PersonasEnActividad_idGrupos_fkey" FOREIGN KEY ("idGrupos") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
