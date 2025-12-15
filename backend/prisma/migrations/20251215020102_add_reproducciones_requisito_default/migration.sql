-- AlterTable
ALTER TABLE "public"."Cancion" ADD COLUMN     "reproducciones" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."ListaPopularidad" ADD COLUMN     "requisito" INTEGER NOT NULL DEFAULT 1000000;

-- AlterTable
ALTER TABLE "public"."Premio" ADD COLUMN     "requisito" INTEGER NOT NULL DEFAULT 1000000;
