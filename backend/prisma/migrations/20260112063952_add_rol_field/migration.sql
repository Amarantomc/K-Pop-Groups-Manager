/*
  Warnings:

  - You are about to drop the column `roles` on the `Solicitud` table. All the data in the column will be lost.
  - Added the required column `rol` to the `AprendizSolicitaGrupo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `ArtistaSolicitaGrupo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Solicitud" DROP COLUMN "roles";

-- AlterTable
ALTER TABLE "public"."AprendizSolicitaGrupo" ADD COLUMN     "rol" TEXT NOT NULL DEFAULT 'SIN ASIGNAR';

-- AlterTable
ALTER TABLE "public"."ArtistaSolicitaGrupo" ADD COLUMN     "rol" TEXT NOT NULL DEFAULT 'SIN ASIGNAR';
