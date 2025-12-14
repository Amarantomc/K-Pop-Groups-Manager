/*
  Warnings:

  - You are about to drop the column `estadoAprendiz` on the `Aprendiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Aprendiz" DROP COLUMN "estadoAprendiz";

-- AlterTable
ALTER TABLE "public"."AprendizEnAgencia" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'en entrenamiento';
