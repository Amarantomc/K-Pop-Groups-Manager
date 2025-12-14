/*
  Warnings:

  - You are about to drop the `AlbúmPremiado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CanciónEnListaDePopularidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvaluaciónAprendiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AlbúmPremiado" DROP CONSTRAINT "AlbúmPremiado_idAlb_fkey";

-- DropForeignKey
ALTER TABLE "public"."AlbúmPremiado" DROP CONSTRAINT "AlbúmPremiado_idPremio_fkey";

-- DropForeignKey
ALTER TABLE "public"."CanciónEnListaDePopularidad" DROP CONSTRAINT "CanciónEnListaDePopularidad_idCa_fkey";

-- DropForeignKey
ALTER TABLE "public"."CanciónEnListaDePopularidad" DROP CONSTRAINT "CanciónEnListaDePopularidad_idLista_fkey";

-- DropForeignKey
ALTER TABLE "public"."EvaluaciónAprendiz" DROP CONSTRAINT "EvaluaciónAprendiz_idAg_fkey";

-- DropForeignKey
ALTER TABLE "public"."EvaluaciónAprendiz" DROP CONSTRAINT "EvaluaciónAprendiz_idAp_fkey";

-- DropTable
DROP TABLE "public"."AlbúmPremiado";

-- DropTable
DROP TABLE "public"."CanciónEnListaDePopularidad";

-- DropTable
DROP TABLE "public"."EvaluaciónAprendiz";

-- CreateTable
CREATE TABLE "public"."AlbumPremiado" (
    "idAlb" INTEGER NOT NULL,
    "idPremio" INTEGER NOT NULL,
    "año" INTEGER NOT NULL,

    CONSTRAINT "AlbumPremiado_pkey" PRIMARY KEY ("idAlb","idPremio")
);

-- CreateTable
CREATE TABLE "public"."CancionEnListaDePopularidad" (
    "idCa" INTEGER NOT NULL,
    "idLista" INTEGER NOT NULL,
    "posicion" INTEGER NOT NULL,
    "año" INTEGER NOT NULL,

    CONSTRAINT "CancionEnListaDePopularidad_pkey" PRIMARY KEY ("idCa","idLista")
);

-- CreateTable
CREATE TABLE "public"."EvaluacionAprendiz" (
    "idAp" INTEGER NOT NULL,
    "idAg" INTEGER NOT NULL,
    "fechaEvaluacion" TIMESTAMP(3) NOT NULL,
    "evaluacion" INTEGER NOT NULL,

    CONSTRAINT "EvaluacionAprendiz_pkey" PRIMARY KEY ("idAp","idAg","fechaEvaluacion")
);

-- AddForeignKey
ALTER TABLE "public"."AlbumPremiado" ADD CONSTRAINT "AlbumPremiado_idAlb_fkey" FOREIGN KEY ("idAlb") REFERENCES "public"."Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlbumPremiado" ADD CONSTRAINT "AlbumPremiado_idPremio_fkey" FOREIGN KEY ("idPremio") REFERENCES "public"."Premio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CancionEnListaDePopularidad" ADD CONSTRAINT "CancionEnListaDePopularidad_idCa_fkey" FOREIGN KEY ("idCa") REFERENCES "public"."Cancion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CancionEnListaDePopularidad" ADD CONSTRAINT "CancionEnListaDePopularidad_idLista_fkey" FOREIGN KEY ("idLista") REFERENCES "public"."ListaPopularidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EvaluacionAprendiz" ADD CONSTRAINT "EvaluacionAprendiz_idAp_fkey" FOREIGN KEY ("idAp") REFERENCES "public"."Aprendiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EvaluacionAprendiz" ADD CONSTRAINT "EvaluacionAprendiz_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
