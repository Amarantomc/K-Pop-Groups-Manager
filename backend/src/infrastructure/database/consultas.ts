// consultas.ts
import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

async function consultas() {
 
    
const resultadoSQL = await prisma.$queryRaw`
    SELECT * from "Cancion"
       
  `
  console.table(resultadoSQL)
}

consultas()
  .catch(console.error)
  .finally(() => prisma.$disconnect())