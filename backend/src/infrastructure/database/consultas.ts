// consultas.ts
import { stringify } from 'querystring'
import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

async function consultas() {
 
    
// const resultadoSQL = await prisma.$queryRaw`
//     SELECT * from "Cancion"
       
//   `
//   console.table(resultadoSQL)

   const artists = await prisma.$queryRaw`
    SELECT DISTINCT
      a."idAp",
      a."idGr",
      a."nombreArtistico",
      a."fechaDebut",
      a."estadoArtista",
      -- Datos del grupo actual
      g."nombreCompleto" as "grupoNombre",
      g."fechaDebut" as "grupoFechaDebut",
      g."estadoGrupo",
      
      -- Datos del contrato
      c."fechaInicio" as "contratoFechaInicio",
      c."estado" as "contratoEstado",
      c."condicionesIniciales",
      c."distribucionIngresos"
       
    FROM "Artista" a
     JOIN "Grupo" g ON a."idGr" = g."id"
     JOIN "Contrato" c ON a."idAp" = c."idAp" 
      AND a."idGr" = c."idGr" 
      AND c."idAg" = ${1}
      AND c."fechaFinalizacion" IS NULL
       
      
    -- Join con historial de grupos para verificar participación en debut
      JOIN "ArtistaEnGrupo" aeg ON a."idAp" = aeg."idAp" 
      AND a."idGr" = aeg."idGrupoDebut"
     JOIN "Grupo" g2 ON aeg."idGr" = g2."id"
    WHERE 
      -- La fecha de debut del grupo debe estar entre fechaInicio y fechaFinalizacion
      g2."fechaDebut" >= aeg."fechaInicio"
      AND (
        aeg."fechaFinalizacion" IS NULL 
        OR g2."fechaDebut" <= aeg."fechaFinalizacion"
      )
    ORDER BY a."nombreArtistico"
  `;

 console.log(artists)
 
      
}

consultas()
  .catch(console.error)
  .finally(() => prisma.$disconnect())