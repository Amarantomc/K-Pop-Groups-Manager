-- CreateTable
CREATE TABLE "public"."PerfilManager" (
    "userId" INTEGER NOT NULL,
    "agenciaId" INTEGER NOT NULL,

    CONSTRAINT "PerfilManager_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."PerfilDirector" (
    "userId" INTEGER NOT NULL,
    "agenciaId" INTEGER NOT NULL,

    CONSTRAINT "PerfilDirector_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."PerfilAprendiz" (
    "userId" INTEGER NOT NULL,
    "aprendizId" INTEGER NOT NULL,

    CONSTRAINT "PerfilAprendiz_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."PerfilArtista" (
    "userId" INTEGER NOT NULL,
    "IdAp" INTEGER NOT NULL,
    "IdGr" INTEGER NOT NULL,

    CONSTRAINT "PerfilArtista_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PerfilAprendiz_aprendizId_key" ON "public"."PerfilAprendiz"("aprendizId");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilArtista_IdAp_IdGr_key" ON "public"."PerfilArtista"("IdAp", "IdGr");

-- AddForeignKey
ALTER TABLE "public"."PerfilManager" ADD CONSTRAINT "PerfilManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilManager" ADD CONSTRAINT "PerfilManager_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "public"."Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilDirector" ADD CONSTRAINT "PerfilDirector_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilDirector" ADD CONSTRAINT "PerfilDirector_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "public"."Agencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilAprendiz" ADD CONSTRAINT "PerfilAprendiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilAprendiz" ADD CONSTRAINT "PerfilAprendiz_aprendizId_fkey" FOREIGN KEY ("aprendizId") REFERENCES "public"."Aprendiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilArtista" ADD CONSTRAINT "PerfilArtista_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilArtista" ADD CONSTRAINT "PerfilArtista_IdAp_IdGr_fkey" FOREIGN KEY ("IdAp", "IdGr") REFERENCES "public"."Artista"("idAp", "idGr") ON DELETE RESTRICT ON UPDATE CASCADE;
