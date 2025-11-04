// seeds.ts
import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. CREAR AGENCIAS
   
  const smEntertainment = await prisma.agencia.create({
    data: { nombre: "SM Entertainment", ubicacion: "Seúl", fechaFundacion: new Date("1995-02-14") }
  })
  const ygEntertainment = await prisma.agencia.create({
    data: { nombre: "YG Entertainment", ubicacion: "Seúl", fechaFundacion: new Date("1996-03-24") }
  })
  const jypEntertainment = await prisma.agencia.create({
    data: { nombre: "JYP Entertainment", ubicacion: "Seúl", fechaFundacion: new Date("1997-04-25") }
  })

  // 2. CREAR CONCEPTOS
   
  const conceptoFuturista = await prisma.concepto.create({
    data: { descripcion: "Concepto futurista y tecnológico" }
  })
  const conceptoUrbano = await prisma.concepto.create({
    data: { descripcion: "Concepto urbano y street style" }
  })
  const conceptoElegante = await prisma.concepto.create({
    data: { descripcion: "Concepto elegante y sofisticado" }
  })

  // 3. CREAR CONCEPTOS VISUALES
   
  await prisma.conceptoVisual.createMany({
    data: [
      { idConcepto: conceptoFuturista.id, imagen: "futurista-concept.jpg" },
      { idConcepto: conceptoUrbano.id, imagen: "urbano-concept.jpg" },
      { idConcepto: conceptoElegante.id, imagen: "elegante-concept.jpg" }
    ]
  })

  // 4. CREAR GRUPOS
  
  const nct127 = await prisma.grupo.create({
    data: {
      nombreCompleto: "NCT 127",
      fechaDebut: new Date("2016-07-07"),
      estadoGrupo: "Activo",
      idConcepto: conceptoFuturista.id,
      Nomiembros: 9
    }
  })
  const blackpink = await prisma.grupo.create({
    data: {
      nombreCompleto: "BLACKPINK", 
      fechaDebut: new Date("2016-08-08"),
      estadoGrupo: "Activo",
      idConcepto: conceptoUrbano.id,
      Nomiembros: 4
    }
  })
  const twice = await prisma.grupo.create({
    data: {
      nombreCompleto: "TWICE",
      fechaDebut: new Date("2015-10-20"),
      estadoGrupo: "Activo", 
      idConcepto: conceptoElegante.id,
      Nomiembros: 9
    }
  })

  // 5. CREAR APRENDICES
   
  const aprendiz1 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Kim Minju",
      fechaNacimiento: new Date("2001-02-05"),
      edad: 22,
      nivelEntrenamiento: 3,
      estadoAprendiz: "En entrenamiento"
    }
  })
  const aprendiz2 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Park Jisung",
      fechaNacimiento: new Date("2002-02-05"), 
      edad: 21,
      nivelEntrenamiento: 2,
      estadoAprendiz: "En entrenamiento"
    }
  })
  const aprendiz3 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Lee Chaeryeong",
      fechaNacimiento: new Date("2001-06-05"),
      edad: 22,
      nivelEntrenamiento: 4,
      estadoAprendiz: "En entrenamiento"
    }
  })

  // 6. CREAR ARTISTAS
   
  const artista1 = await prisma.artista.create({
    data: {
      idAp: aprendiz1.id,
      idGr: nct127.id,
      nombreArtistico: "Taeyong",
      fsechaDebut: new Date("2016-07-07"),
      estadoArtista: "Activo"
    }
  })
  const artista2 = await prisma.artista.create({
    data: {
      idAp: aprendiz2.id,
      idGr: blackpink.id,
      nombreArtistico: "Lisa", 
      fsechaDebut: new Date("2016-08-08"),
      estadoArtista: "Activo"
    }
  })
  const artista3 = await prisma.artista.create({
    data: {
      idAp: aprendiz3.id,
      idGr: twice.id,
      nombreArtistico: "Chaeyoung",
      fsechaDebut: new Date("2015-10-20"),
      estadoArtista: "Activo"
    }
  })


    const cancionesNCT = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Kick It", genero: "K-Pop", productor: "Dem Jointz", fechaLanzamiento: new Date("2020-03-06") } }),
    prisma.cancion.create({ data: { titulo: "Pandora's Box", genero: "K-Pop", productor: "Kenzie", fechaLanzamiento: new Date("2020-03-06") } }),
    prisma.cancion.create({ data: { titulo: "Day Dream", genero: "K-Pop", productor: "Hitchhiker", fechaLanzamiento: new Date("2020-03-06") } })
  ])

  const cancionesBlackpink = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Lovesick Girls", genero: "K-Pop", productor: "Teddy Park", fechaLanzamiento: new Date("2020-10-02") } }),
    prisma.cancion.create({ data: { titulo: "How You Like That", genero: "K-Pop", productor: "Teddy Park", fechaLanzamiento: new Date("2020-10-02") } }),
    prisma.cancion.create({ data: { titulo: "Ice Cream", genero: "K-Pop", productor: "Teddy Park", fechaLanzamiento: new Date("2020-10-02") } })
  ])

  const cancionesTwice = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Scientist", genero: "K-Pop", productor: "J.Y. Park", fechaLanzamiento: new Date("2021-11-12") } }),
    prisma.cancion.create({ data: { titulo: "Moonlight", genero: "K-Pop", productor: "J.Y. Park", fechaLanzamiento: new Date("2021-11-12") } }),
    prisma.cancion.create({ data: { titulo: "Icon", genero: "K-Pop", productor: "J.Y. Park", fechaLanzamiento: new Date("2021-11-12") } })
  ])

   
  const albumNCT = await prisma.album.create({
    data: {
      idGrupo: nct127.id,
      idArt: artista1.idAp,
      titulo: "Neo Zone",
      fechaLanzamiento: new Date("2020-03-06"),
      productor: "Lee Soo-man",
      NoCanciones: 6,
      NoCopiasVendidas: 1000000,
      Canciones: {
        connect: cancionesNCT.map(c => ({ id: c.id }))
      }
    },
    include: {
      Canciones: true
    }
    
  })
  const albumBlackpink = await prisma.album.create({
    data: {
      idGrupo: blackpink.id,
      idArt: artista2.idAp,
      titulo: "THE ALBUM",
      fechaLanzamiento: new Date("2020-10-02"),
      productor: "Teddy Park",
      NoCanciones: 8,
      NoCopiasVendidas: 2500000,
      Canciones: {
        connect: cancionesBlackpink.map(c => ({ id: c.id }))
      }
    },
    include: {
      Canciones: true
    }
    
  })
  const albumTwice = await prisma.album.create({
    data: {
      idGrupo: twice.id,
      idArt: artista3.idAp,
      titulo: "Formula of Love",
      fechaLanzamiento: new Date("2021-11-12"),
      productor: "J.Y. Park", 
      NoCanciones: 7,
      NoCopiasVendidas: 800000,
      Canciones: {
        connect: cancionesTwice.map(c => ({ id: c.id }))
      }
    },
    include: {
      Canciones: true
    }
    
  })

  
   


  
 
 

 

  // 10. CREAR LISTAS DE POPULARIDAD Y VINCULAR CANCIONES
   
  const melonChart = await prisma.listaPopularidad.create({
    data: { nombre: "Melon Top 100", tipoLista: "Digital" }
  })

  // Vincular algunas canciones a la lista de popularidad
  await prisma.cancionEnListaDePopularidad.createMany({
    data: [
      { idCa: cancionesNCT[0].id, idLista: melonChart.id, posicion: 1, año: 2020 },
      { idCa: cancionesBlackpink[0].id, idLista: melonChart.id, posicion: 2, año: 2020 },
      { idCa: cancionesTwice[0].id, idLista: melonChart.id, posicion: 3, año: 2021 }
    ]
  })

  // 11. CREAR CONTRATOS
   
  await prisma.contrato.createMany({
    data: [
      {
        idAg: smEntertainment.id,
        idAp: artista1.idAp,
        idGr: artista1.idGr,
        fechaInicio: new Date("2020-01-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato estándar por 7 años",
        distribuciónIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: ygEntertainment.id, 
        idAp: artista2.idAp,
        idGr: artista2.idGr,
        fechaInicio: new Date("2019-05-01"),
        estado: "Activo", 
        condicionesIniciales: "Contrato exclusivo por 5 años",
        distribuciónIngresos: "60% agencia, 40% artista"
      }
    ]
  })

  // 12. CREAR LANZAMIENTOS DE ÁLBUMES
   
  await prisma.artistaLanzaAlbum.create({
    data: {
      idAp: artista1.idAp,
      idGr: artista1.idGr,
      idAlb: albumNCT.id,
      idConceptoVisual: conceptoFuturista.id
    }
  })

  await prisma.grupoLanzaAlbum.create({
    data: {
      idGr: nct127.id,
      idAlb: albumNCT.id, 
      idConceptoVisual: conceptoFuturista.id
    }
  })

 
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })