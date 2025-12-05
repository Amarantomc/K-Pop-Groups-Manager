-- DropForeignKey
ALTER TABLE "public"."ContratoGrupo" DROP CONSTRAINT "ContratoGrupo_IdGr_fkey";

-- AlterTable
ALTER TABLE "public"."ContratoGrupo" ALTER COLUMN "fechaFinalizacion" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ContratoGrupo" ADD CONSTRAINT "ContratoGrupo_IdGr_fkey" FOREIGN KEY ("IdGr") REFERENCES "public"."Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
