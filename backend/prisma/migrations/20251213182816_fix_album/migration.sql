/*
  Warnings:

  - You are about to drop the column `idGrupo` on the `Album` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Album" DROP CONSTRAINT "Album_idGrupo_fkey";

-- AlterTable
ALTER TABLE "public"."Album" DROP COLUMN "idGrupo";
