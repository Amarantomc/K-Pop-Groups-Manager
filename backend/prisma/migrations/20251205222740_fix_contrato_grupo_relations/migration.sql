/*
  Warnings:

  - Made the column `idAg` on table `ContratoGrupo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IdGr` on table `ContratoGrupo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."ContratoGrupo" DROP CONSTRAINT "ContratoGrupo_IdGr_fkey";

-- AlterTable
ALTER TABLE "public"."ContratoGrupo" ALTER COLUMN "idAg" SET NOT NULL,
ALTER COLUMN "IdGr" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ContratoGrupo" ADD CONSTRAINT "ContratoGrupo_IdGr_fkey" FOREIGN KEY ("IdGr") REFERENCES "public"."Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
