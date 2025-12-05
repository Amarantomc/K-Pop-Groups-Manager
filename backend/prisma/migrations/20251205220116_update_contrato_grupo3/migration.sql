-- DropForeignKey
ALTER TABLE "public"."ContratoGrupo" DROP CONSTRAINT "ContratoGrupo_IdGr_fkey";

-- AlterTable
ALTER TABLE "public"."ContratoGrupo" ALTER COLUMN "idAg" DROP NOT NULL,
ALTER COLUMN "IdGr" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ContratoGrupo" ADD CONSTRAINT "ContratoGrupo_IdGr_fkey" FOREIGN KEY ("IdGr") REFERENCES "public"."Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
