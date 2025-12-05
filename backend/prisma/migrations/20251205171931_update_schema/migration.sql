/*
  Warnings:

  - The primary key for the `PersonasEnActividad` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Aprendiz" DROP CONSTRAINT "Aprendiz_idSolicitud_fkey";

-- DropForeignKey
ALTER TABLE "public"."Artista" DROP CONSTRAINT "Artista_idSolicitud_fkey";

-- DropForeignKey
ALTER TABLE "public"."PersonasEnActividad" DROP CONSTRAINT "PersonasEnActividad_idAp_idGr_fkey";

-- DropForeignKey
ALTER TABLE "public"."PersonasEnActividad" DROP CONSTRAINT "PersonasEnActividad_idGrupos_fkey";

-- AlterTable
ALTER TABLE "public"."Aprendiz" ALTER COLUMN "idSolicitud" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Artista" ALTER COLUMN "idSolicitud" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."PersonasEnActividad" DROP CONSTRAINT "PersonasEnActividad_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "idAp" DROP NOT NULL,
ALTER COLUMN "idGr" DROP NOT NULL,
ALTER COLUMN "idGrupos" DROP NOT NULL,
ADD CONSTRAINT "PersonasEnActividad_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Aprendiz" ADD CONSTRAINT "Aprendiz_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."Solicitud"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Artista" ADD CONSTRAINT "Artista_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."Solicitud"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PersonasEnActividad" ADD CONSTRAINT "PersonasEnActividad_idAp_idGr_fkey" FOREIGN KEY ("idAp", "idGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PersonasEnActividad" ADD CONSTRAINT "PersonasEnActividad_idGrupos_fkey" FOREIGN KEY ("idGrupos") REFERENCES "public"."Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
