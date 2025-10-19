/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Agencia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "fechaFundacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Aprendiz" (
    "id" SERIAL NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edad" INTEGER NOT NULL,
    "nivelEntrenamiento" INTEGER NOT NULL,
    "estadoAprendiz" TEXT NOT NULL,

    CONSTRAINT "Aprendiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Actividad" (
    "id" SERIAL NOT NULL,
    "responsable" TEXT NOT NULL,
    "lugar" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoActividad" TEXT NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ingreso" (
    "idIng" SERIAL NOT NULL,
    "idAct" INTEGER NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Ingreso_pkey" PRIMARY KEY ("idIng","idAct")
);

-- CreateTable
CREATE TABLE "public"."Concepto" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Concepto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConceptoVisual" (
    "idConcepto" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,

    CONSTRAINT "ConceptoVisual_pkey" PRIMARY KEY ("idConcepto")
);

-- CreateTable
CREATE TABLE "public"."Grupo" (
    "id" SERIAL NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "fechaDebut" TIMESTAMP(3) NOT NULL,
    "estadoGrupo" TEXT NOT NULL,
    "idConcepto" INTEGER NOT NULL,
    "Nomiembros" INTEGER NOT NULL,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Album" (
    "id" SERIAL NOT NULL,
    "idGrupo" INTEGER NOT NULL,
    "idArt" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "fechaLanzamiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productor" TEXT NOT NULL,
    "NoCanciones" INTEGER NOT NULL,
    "NoCopiasVendidas" INTEGER NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Artista" (
    "idAp" INTEGER NOT NULL,
    "idGr" INTEGER NOT NULL,
    "nombreArtistico" TEXT NOT NULL,
    "fsechaDebut" TIMESTAMP(3) NOT NULL,
    "estadoArtista" TEXT NOT NULL,

    CONSTRAINT "Artista_pkey" PRIMARY KEY ("idAp","idGr")
);

-- CreateTable
CREATE TABLE "public"."Solicitud" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ListaPopularidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoLista" TEXT NOT NULL,

    CONSTRAINT "ListaPopularidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cancion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "productor" TEXT NOT NULL,
    "fechaLanzamiento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cancion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Premio" (
    "id" SERIAL NOT NULL,
    "tituloPremio" TEXT NOT NULL,
    "nombreAcademia" TEXT NOT NULL,

    CONSTRAINT "Premio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contrato" (
    "idAg" INTEGER NOT NULL,
    "idAp" INTEGER NOT NULL,
    "idGr" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFinalizacion" TIMESTAMP(3),
    "estado" TEXT NOT NULL,
    "condicionesIniciales" TEXT NOT NULL,
    "distribuciónIngresos" TEXT NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("idAg","idAp","idGr","fechaInicio")
);

-- CreateTable
CREATE TABLE "public"."ArtistaEnGrupo" (
    "idAp" INTEGER NOT NULL,
    "idGrupoDebut" INTEGER NOT NULL,
    "idGr" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFinalizacion" TIMESTAMP(3),
    "rol" TEXT NOT NULL,

    CONSTRAINT "ArtistaEnGrupo_pkey" PRIMARY KEY ("idAp","idGrupoDebut","idGr","fechaInicio")
);

-- CreateTable
CREATE TABLE "public"."AlbúmPremiado" (
    "idAlb" INTEGER NOT NULL,
    "idPremio" INTEGER NOT NULL,
    "año" INTEGER NOT NULL,

    CONSTRAINT "AlbúmPremiado_pkey" PRIMARY KEY ("idAlb","idPremio")
);

-- CreateTable
CREATE TABLE "public"."CanciónEnListaDePopularidad" (
    "idCa" INTEGER NOT NULL,
    "idLista" INTEGER NOT NULL,
    "posicion" INTEGER NOT NULL,
    "año" INTEGER NOT NULL,

    CONSTRAINT "CanciónEnListaDePopularidad_pkey" PRIMARY KEY ("idCa","idLista")
);

-- CreateTable
CREATE TABLE "public"."AprendizEnAgencia" (
    "idAp" INTEGER NOT NULL,
    "idAg" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFinalizacion" TIMESTAMP(3),

    CONSTRAINT "AprendizEnAgencia_pkey" PRIMARY KEY ("idAp","idAg","fechaInicio")
);

-- CreateTable
CREATE TABLE "public"."EvaluaciónAprendiz" (
    "idAp" INTEGER NOT NULL,
    "idAg" INTEGER NOT NULL,
    "fechaEvaluacion" TIMESTAMP(3) NOT NULL,
    "evaluacion" INTEGER NOT NULL,

    CONSTRAINT "EvaluaciónAprendiz_pkey" PRIMARY KEY ("idAp","idAg","fechaEvaluacion")
);

-- CreateTable
CREATE TABLE "public"."ArtistaEnActividad" (
    "idAp" INTEGER NOT NULL,
    "idGr" INTEGER NOT NULL,
    "idAct" INTEGER NOT NULL,
    "aceptado" BOOLEAN NOT NULL,

    CONSTRAINT "ArtistaEnActividad_pkey" PRIMARY KEY ("idAp","idGr","idAct")
);

-- CreateTable
CREATE TABLE "public"."GrupoEnActividad" (
    "idGr" INTEGER NOT NULL,
    "idAct" INTEGER NOT NULL,
    "aceptado" BOOLEAN NOT NULL,

    CONSTRAINT "GrupoEnActividad_pkey" PRIMARY KEY ("idGr","idAct")
);

-- CreateTable
CREATE TABLE "public"."ArtistaLanzaÁlbum" (
    "idAp" INTEGER NOT NULL,
    "idGr" INTEGER NOT NULL,
    "idAlb" INTEGER NOT NULL,
    "idConceptoVisual" INTEGER NOT NULL,

    CONSTRAINT "ArtistaLanzaÁlbum_pkey" PRIMARY KEY ("idAp","idGr","idAlb")
);

-- CreateTable
CREATE TABLE "public"."GrupoLanzaÁlbum" (
    "idGr" INTEGER NOT NULL,
    "idAlb" INTEGER NOT NULL,
    "idConceptoVisual" INTEGER NOT NULL,

    CONSTRAINT "GrupoLanzaÁlbum_pkey" PRIMARY KEY ("idGr","idAlb")
);

-- CreateTable
CREATE TABLE "public"."AprendizSolicitaGrupo" (
    "idAp" INTEGER NOT NULL,
    "idAg" INTEGER NOT NULL,
    "idSolicitud" INTEGER NOT NULL,
    "aprobada" BOOLEAN NOT NULL,

    CONSTRAINT "AprendizSolicitaGrupo_pkey" PRIMARY KEY ("idAp","idAg","idSolicitud")
);

-- CreateTable
CREATE TABLE "public"."ArtistaSolicitaGrupo" (
    "idAp" INTEGER NOT NULL,
    "idGr" INTEGER NOT NULL,
    "idAg" INTEGER NOT NULL,
    "idSolicitud" INTEGER NOT NULL,
    "aprobada" BOOLEAN NOT NULL,

    CONSTRAINT "ArtistaSolicitaGrupo_pkey" PRIMARY KEY ("idAp","idGr","idAg","idSolicitud")
);

-- CreateTable
CREATE TABLE "public"."_AgenciaToGrupo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AgenciaToGrupo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AlbumToCancion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AlbumToCancion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AgenciaToGrupo_B_index" ON "public"."_AgenciaToGrupo"("B");

-- CreateIndex
CREATE INDEX "_AlbumToCancion_B_index" ON "public"."_AlbumToCancion"("B");

-- AddForeignKey
ALTER TABLE "public"."Ingreso" ADD CONSTRAINT "Ingreso_idAct_fkey" FOREIGN KEY ("idAct") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConceptoVisual" ADD CONSTRAINT "ConceptoVisual_idConcepto_fkey" FOREIGN KEY ("idConcepto") REFERENCES "public"."Concepto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Grupo" ADD CONSTRAINT "Grupo_idConcepto_fkey" FOREIGN KEY ("idConcepto") REFERENCES "public"."Concepto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Album" ADD CONSTRAINT "Album_idGrupo_fkey" FOREIGN KEY ("idGrupo") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Artista" ADD CONSTRAINT "Artista_idGr_fkey" FOREIGN KEY ("idGr") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Artista" ADD CONSTRAINT "Artista_idAp_fkey" FOREIGN KEY ("idAp") REFERENCES "public"."Aprendiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contrato" ADD CONSTRAINT "Contrato_idAp_idGr_fkey" FOREIGN KEY ("idAp", "idGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contrato" ADD CONSTRAINT "Contrato_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaEnGrupo" ADD CONSTRAINT "ArtistaEnGrupo_idAp_idGrupoDebut_fkey" FOREIGN KEY ("idAp", "idGrupoDebut") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaEnGrupo" ADD CONSTRAINT "ArtistaEnGrupo_idGr_fkey" FOREIGN KEY ("idGr") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlbúmPremiado" ADD CONSTRAINT "AlbúmPremiado_idAlb_fkey" FOREIGN KEY ("idAlb") REFERENCES "public"."Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlbúmPremiado" ADD CONSTRAINT "AlbúmPremiado_idPremio_fkey" FOREIGN KEY ("idPremio") REFERENCES "public"."Premio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CanciónEnListaDePopularidad" ADD CONSTRAINT "CanciónEnListaDePopularidad_idCa_fkey" FOREIGN KEY ("idCa") REFERENCES "public"."Cancion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CanciónEnListaDePopularidad" ADD CONSTRAINT "CanciónEnListaDePopularidad_idLista_fkey" FOREIGN KEY ("idLista") REFERENCES "public"."ListaPopularidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AprendizEnAgencia" ADD CONSTRAINT "AprendizEnAgencia_idAp_fkey" FOREIGN KEY ("idAp") REFERENCES "public"."Aprendiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AprendizEnAgencia" ADD CONSTRAINT "AprendizEnAgencia_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EvaluaciónAprendiz" ADD CONSTRAINT "EvaluaciónAprendiz_idAp_fkey" FOREIGN KEY ("idAp") REFERENCES "public"."Aprendiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EvaluaciónAprendiz" ADD CONSTRAINT "EvaluaciónAprendiz_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaEnActividad" ADD CONSTRAINT "ArtistaEnActividad_idAp_idGr_fkey" FOREIGN KEY ("idAp", "idGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaEnActividad" ADD CONSTRAINT "ArtistaEnActividad_idAct_fkey" FOREIGN KEY ("idAct") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoEnActividad" ADD CONSTRAINT "GrupoEnActividad_idGr_fkey" FOREIGN KEY ("idGr") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoEnActividad" ADD CONSTRAINT "GrupoEnActividad_idAct_fkey" FOREIGN KEY ("idAct") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaLanzaÁlbum" ADD CONSTRAINT "ArtistaLanzaÁlbum_idAp_idGr_fkey" FOREIGN KEY ("idAp", "idGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaLanzaÁlbum" ADD CONSTRAINT "ArtistaLanzaÁlbum_idAlb_fkey" FOREIGN KEY ("idAlb") REFERENCES "public"."Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaLanzaÁlbum" ADD CONSTRAINT "ArtistaLanzaÁlbum_idConceptoVisual_fkey" FOREIGN KEY ("idConceptoVisual") REFERENCES "public"."ConceptoVisual"("idConcepto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoLanzaÁlbum" ADD CONSTRAINT "GrupoLanzaÁlbum_idGr_fkey" FOREIGN KEY ("idGr") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoLanzaÁlbum" ADD CONSTRAINT "GrupoLanzaÁlbum_idAlb_fkey" FOREIGN KEY ("idAlb") REFERENCES "public"."Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoLanzaÁlbum" ADD CONSTRAINT "GrupoLanzaÁlbum_idConceptoVisual_fkey" FOREIGN KEY ("idConceptoVisual") REFERENCES "public"."ConceptoVisual"("idConcepto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AprendizSolicitaGrupo" ADD CONSTRAINT "AprendizSolicitaGrupo_idAp_fkey" FOREIGN KEY ("idAp") REFERENCES "public"."Aprendiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AprendizSolicitaGrupo" ADD CONSTRAINT "AprendizSolicitaGrupo_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AprendizSolicitaGrupo" ADD CONSTRAINT "AprendizSolicitaGrupo_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaSolicitaGrupo" ADD CONSTRAINT "ArtistaSolicitaGrupo_idAp_idGr_fkey" FOREIGN KEY ("idAp", "idGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaSolicitaGrupo" ADD CONSTRAINT "ArtistaSolicitaGrupo_idAg_fkey" FOREIGN KEY ("idAg") REFERENCES "public"."Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistaSolicitaGrupo" ADD CONSTRAINT "ArtistaSolicitaGrupo_idSolicitud_fkey" FOREIGN KEY ("idSolicitud") REFERENCES "public"."Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AgenciaToGrupo" ADD CONSTRAINT "_AgenciaToGrupo_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Agencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AgenciaToGrupo" ADD CONSTRAINT "_AgenciaToGrupo_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AlbumToCancion" ADD CONSTRAINT "_AlbumToCancion_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AlbumToCancion" ADD CONSTRAINT "_AlbumToCancion_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Cancion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
