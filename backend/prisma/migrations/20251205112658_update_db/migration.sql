/*
  Warnings:

  - You are about to drop the column `idArt` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `aprobada` on the `AprendizSolicitaGrupo` table. All the data in the column will be lost.
  - You are about to drop the column `fsechaDebut` on the `Artista` table. All the data in the column will be lost.
  - You are about to drop the column `idConceptoVisual` on the `ArtistaLanzaÁlbum` table. All the data in the column will be lost.
  - You are about to drop the column `aprobada` on the `ArtistaSolicitaGrupo` table. All the data in the column will be lost.
  - The primary key for the `ConceptoVisual` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idConcepto` on the `ConceptoVisual` table. All the data in the column will be lost.
  - You are about to drop the column `distribuciónIngresos` on the `Contrato` table. All the data in the column will be lost.
  - You are about to drop the column `idConceptoVisual` on the `GrupoLanzaÁlbum` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Solicitud` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idAp]` on the table `Artista` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipoEvento` to the `Actividad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idSolicitud` to the `Aprendiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `AprendizSolicitaGrupo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaDebut` to the `Artista` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idSolicitud` to the `Artista` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idGrupos` to the `ArtistaEnActividad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `ArtistaSolicitaGrupo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Concepto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distribucionIngresos` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idConceptoVisual` to the `Grupo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idAgencia` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idConcepto` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreGrupo` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AprendizEnAgencia" DROP CONSTRAINT "AprendizEnAgencia_idAg_fkey";

-- DropForeignKey
ALTER TABLE "public"."AprendizEnAgencia" DROP CONSTRAINT "AprendizEnAgencia_idAp_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArtistaLanzaÁlbum" DROP CONSTRAINT "ArtistaLanzaÁlbum_idConceptoVisual_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConceptoVisual" DROP CONSTRAINT "ConceptoVisual_idConcepto_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contrato" DROP CONSTRAINT "Contrato_idAg_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contrato" DROP CONSTRAINT "Contrato_idAp_idGr_fkey";

-- DropForeignKey
ALTER TABLE "public"."EvaluaciónAprendiz" DROP CONSTRAINT "EvaluaciónAprendiz_idAg_fkey";

-- DropForeignKey
ALTER TABLE "public"."EvaluaciónAprendiz" DROP CONSTRAINT "EvaluaciónAprendiz_idAp_fkey";

-- DropForeignKey
ALTER TABLE "public"."GrupoEnActividad" DROP CONSTRAINT "GrupoEnActividad_idGr_fkey";

-- DropForeignKey
ALTER TABLE "public"."GrupoLanzaÁlbum" DROP CONSTRAINT "GrupoLanzaÁlbum_idConceptoVisual_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ingreso" DROP CONSTRAINT "Ingreso_idAct_fkey";

-- AlterTable
ALTER TABLE "public"."Actividad" ADD COLUMN     "tipoEvento" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Album" DROP COLUMN "idArt";

-- AlterTable
ALTER TABLE "public"."Aprendiz" ADD COLUMN     "idSolicitud" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AprendizSolicitaGrupo" DROP COLUMN "aprobada",
ADD COLUMN     "estado" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Artista" DROP COLUMN "fsechaDebut",
ADD COLUMN     "fechaDebut" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "idSolicitud" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ArtistaEnActividad" ADD COLUMN     "idGrupos" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ArtistaLanzaÁlbum" DROP COLUMN "idConceptoVisual";

-- AlterTable
ALTER TABLE "public"."ArtistaSolicitaGrupo" DROP COLUMN "aprobada",
ADD COLUMN     "estado" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Concepto" ADD COLUMN     "nombre" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ConceptoVisual" DROP CONSTRAINT "ConceptoVisual_pkey",
DROP COLUMN "idConcepto",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ConceptoVisual_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Contrato" DROP COLUMN "distribuciónIngresos",
ADD COLUMN     "distribucionIngresos" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Grupo" ADD COLUMN     "idConceptoVisual" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."GrupoLanzaÁlbum" DROP COLUMN "idConceptoVisual";

-- AlterTable
ALTER TABLE "public"."Solicitud" DROP COLUMN "descripcion",
ADD COLUMN     "idAgencia" INTEGER NOT NULL,
ADD COLUMN     "idConcepto" INTEGER NOT NULL,
ADD COLUMN     "nombreGrupo" TEXT NOT NULL,
ADD COLUMN     "roles" TEXT[];

-- CreateTable
CREATE TABLE "public"."ContratoGrupo" (
    "id" SERIAL NOT NULL,
    "idAg" INTEGER NOT NULL,
    "IdGr" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFinalizacion" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "condicionesIniciales" TEXT NOT NULL,
    "distribucionIngresos" TEXT NOT NULL,

    CONSTRAINT "ContratoGrupo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artista_idAp_key" ON "public"."Artista"("idAp");

-- AddForeignKey
ALTER TABLE "public"."Aprendiz" ADD CONSTRAINT "Aprendiz_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ingreso" ADD CONSTRAINT "Ingreso_idAct_fkey" FOREIGN KEY ("idAct") REFERENCES "public"."Actividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Grupo" ADD CONSTRAINT "Grupo_idConceptoVisual_fkey" FOREIGN KEY ("idConceptoVisual") REFERENCES "public"."ConceptoVisual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Artista" ADD CONSTRAINT "Artista_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contrato" ADD CONSTRAINT "Contrato_idAp_idGr_fkey" FOREIGN KEY ("idAp", "idGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contrato" ADD CONSTRAINT "Contrato_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContratoGrupo" ADD CONSTRAINT "ContratoGrupo_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContratoGrupo" ADD CONSTRAINT "ContratoGrupo_IdGr_fkey" FOREIGN KEY ("IdGr") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AprendizEnAgencia" ADD CONSTRAINT "AprendizEnAgencia_idAp_fkey" FOREIGN KEY ("idAp") REFERENCES "public"."Aprendiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AprendizEnAgencia" ADD CONSTRAINT "AprendizEnAgencia_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EvaluaciónAprendiz" ADD CONSTRAINT "EvaluaciónAprendiz_idAp_fkey" FOREIGN KEY ("idAp") REFERENCES "public"."Aprendiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EvaluaciónAprendiz" ADD CONSTRAINT "EvaluaciónAprendiz_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaEnActividad" ADD CONSTRAINT "ArtistaEnActividad_idGrupos_fkey" FOREIGN KEY ("idGrupos") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
