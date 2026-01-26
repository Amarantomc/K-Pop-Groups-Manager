// seeds.ts
import type { Prisma } from '@prisma/client';
import { PrismaClient } from '../../generated/prisma'
import * as bcrypt from 'bcrypt'
import { Aprendiz } from '../../generated/prisma/index';

const prisma = new PrismaClient()




async function cleanDatabase(prisma: PrismaClient) {
  // El orden importa por claves foráneas
  await prisma.artistaSolicitaGrupo.deleteMany({});
  await prisma.aprendizSolicitaGrupo.deleteMany({});
  await prisma.solicitud.deleteMany({});
  await prisma.personasEnActividad.deleteMany({});
  await prisma.ingreso.deleteMany({});
  await prisma.actividad.deleteMany({});
  await prisma.albumPremiado.deleteMany({});
  await prisma.premio.deleteMany({});
  await prisma.grupoLanzaAlbum.deleteMany({});
  await prisma.artistaLanzaAlbum.deleteMany({});
  await prisma.album.deleteMany({});
  await prisma.cancionEnListaDePopularidad.deleteMany({});
  await prisma.listaPopularidad.deleteMany({});
  await prisma.cancion.deleteMany({});
  await prisma.artistaEnGrupo.deleteMany({});
  await prisma.contratoGrupo.deleteMany({});
  await prisma.contrato.deleteMany({});
  await prisma.artista.deleteMany({});
  await prisma.evaluacionAprendiz.deleteMany({});
  await prisma.aprendizEnAgencia.deleteMany({});
  await prisma.aprendiz.deleteMany({});
  await prisma.grupo.deleteMany({});
  await prisma.conceptoVisual.deleteMany({});
  await prisma.concepto.deleteMany({});
  await prisma.agencia.deleteMany({});
  await prisma.perfilManager.deleteMany({});
  await prisma.perfilDirector.deleteMany({});
  await prisma.perfilAprendiz.deleteMany({});
  await prisma.perfilArtista.deleteMany({});
  await prisma.user.deleteMany({});
}

async function main() {
        // Asociar idSolicitud en Aprendiz (ya hecho arriba)
        // Asociar idSolicitud en Artista (ya hecho arriba)

        // Ya se agregó para PersonasEnActividad (idAp, idGr, idGrupos)

        // No hay más entidades con campos opcionales de FK relevantes para poblar según el schema actual.
      // ...existing code...
    // ...existing code...
  console.log('🌱 Iniciando población de la base de datos...')
  console.log('🧹 Limpiando base de datos...')
  //await cleanDatabase(prisma);
  console.log('✅ Base de datos limpia')



  //#region  CREAR USUARIO ADMINISTRADOR
  console.log('👤 Creando usuario administrador...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "Admin"
    }
  })
  console.log('✅ Usuario administrador creado')
//#endregion







  //#region  CREAR AGENCIAS
  console.log('🏢 Creando agencias...')
  const smEntertainment = await prisma.agencia.create({
    data: { nombre: "SM Entertainment", ubicacion: "Seúl, Gangnam-gu", fechaFundacion: new Date("1995-02-14") }
  })
  const ygEntertainment = await prisma.agencia.create({
    data: { nombre: "YG Entertainment", ubicacion: "Seúl, Mapo-gu", fechaFundacion: new Date("1996-03-11") }
  })
  const jypEntertainment = await prisma.agencia.create({
    data: { nombre: "JYP Entertainment", ubicacion: "Seúl, Gangdong-gu", fechaFundacion: new Date("1997-04-25") }
  })
  const hibeEntertainment = await prisma.agencia.create({
    data: { nombre: "HYBE Corporation", ubicacion: "Seúl, Yongsan-gu", fechaFundacion: new Date("2005-02-01") }
  })
  const starshipEntertainment = await prisma.agencia.create({
    data: { nombre: "Starship Entertainment", ubicacion: "Seúl, Gangnam-gu", fechaFundacion: new Date("2008-01-07") }
  })
  const cubeEntertainment = await prisma.agencia.create({
    data: { nombre: "Cube Entertainment", ubicacion: "Seúl, Seongdong-gu", fechaFundacion: new Date("2008-08-28") }
  })
  const pledisEntertainment = await prisma.agencia.create({
    data: { nombre: "Pledis Entertainment", ubicacion: "Seúl, Gangnam-gu", fechaFundacion: new Date("2007-05-18") }
  })
  console.log('✅ 7 Agencias creadas')
//#endregion







  //#region  CREAR CONCEPTOS
  console.log('🎨 Creando conceptos...')
  const conceptoFuturista = await prisma.concepto.create({
    data: { nombre: "Futurista", descripcion: "Concepto futurista y tecnológico con elementos cyberpunk" }
  })
  const conceptoUrbano = await prisma.concepto.create({
    data: { nombre: "Urbano", descripcion: "Concepto urbano y street style con influencias hip-hop" }
  })
  const conceptoElegante = await prisma.concepto.create({
    data: { nombre: "Elegante", descripcion: "Concepto elegante y sofisticado con estilo clásico" }
  })
  const conceptoCute = await prisma.concepto.create({
    data: { nombre: "Cute", descripcion: "Concepto tierno y juvenil con colores brillantes" }
  })
  const conceptoDark = await prisma.concepto.create({
    data: { nombre: "Dark", descripcion: "Concepto oscuro y misterioso con elementos dramáticos" }
  })
  const conceptoRetro = await prisma.concepto.create({
    data: { nombre: "Retro", descripcion: "Concepto vintage y nostálgico de los 80s-90s" }
  })
  const conceptoFantasia = await prisma.concepto.create({
    data: { nombre: "Fantasía", descripcion: "Concepto fantástico con elementos mágicos" }
  })
  console.log('✅ 7 Conceptos creados')
//#endregion







  //#region  CREAR CONCEPTOS VISUALES
  console.log('🖼️ Creando conceptos visuales...')
  const visualFuturista = await prisma.conceptoVisual.create({
    data: { imagen: "visual-concepts/1765435157607.jpeg" }
  })
  const visualUrbano = await prisma.conceptoVisual.create({
    data: { imagen: "visual-concepts/knotifyaudio_knotificar.webp" }
  })
  const visualElegante = await prisma.conceptoVisual.create({
    data: { imagen: "visual-concepts/Letter_K_violet.png" }
  })
  const visualCute = await prisma.conceptoVisual.create({
    data: { imagen: "visual-concepts/quaver.png" }
  })
  const visualDark = await prisma.conceptoVisual.create({
    data: { imagen: "visual-concepts/vinyl.png" }
  })
  const visualRetro = await prisma.conceptoVisual.create({
    data: { imagen: "visual-concepts/default.png" }
  })
  const visualFantasia = await prisma.conceptoVisual.create({
    data: { imagen: "visual-concepts/default.png" }
  })
  console.log('✅ 7 Conceptos visuales creados')

//#endregion








  //#region  CREAR GRUPOS
  console.log('👥 Creando grupos...')
  const bts2 = await prisma.grupo.create({
    data: {
      nombreCompleto: "Los Malditos de la cibernetica",
      fechaDebut: new Date("2020-07-07"),
      estadoGrupo: "INACTIVO",
      idConcepto: conceptoFuturista.id,
      idConceptoVisual: visualFuturista.id,
      Nomiembros: 9,
      Agencias: { connect: [{ id: smEntertainment.id }] }
    }
  })

  const nct127 = await prisma.grupo.create({
    data: {
      nombreCompleto: "NCT 127",
      fechaDebut: new Date("2016-07-07"),
      estadoGrupo: "ACTIVO",
      idConcepto: conceptoFuturista.id,
      idConceptoVisual: visualFuturista.id,
      Nomiembros: 9,
      Agencias: { connect: [{ id: smEntertainment.id }] }
    }
  })
  const blackpink = await prisma.grupo.create({
    data: {
      nombreCompleto: "BLACKPINK",
      fechaDebut: new Date("2016-08-08"),
      estadoGrupo: "ACTIVO",
      idConcepto: conceptoUrbano.id,
      idConceptoVisual: visualUrbano.id,
      Nomiembros: 4,
      Agencias: { connect: [{ id: ygEntertainment.id }] }
    }
  })
  const twice = await prisma.grupo.create({
    data: {
      nombreCompleto: "TWICE",
      fechaDebut: new Date("2015-10-20"),
      estadoGrupo: "ACTIVO",
      idConcepto: conceptoElegante.id,
      idConceptoVisual: visualElegante.id,
      Nomiembros: 9,
      Agencias: { connect: [{ id: jypEntertainment.id }] }
    }
  })
  const bts = await prisma.grupo.create({
    data: {
      nombreCompleto: "BTS",
      fechaDebut: new Date("2013-06-13"),
      estadoGrupo: "ACTIVO",
      idConcepto: conceptoUrbano.id,
      idConceptoVisual: visualUrbano.id,
      Nomiembros: 7,
      Agencias: { connect: [{ id: hibeEntertainment.id }] }
    }
  })
  const itzy = await prisma.grupo.create({
    data: {
      nombreCompleto: "ITZY",
      fechaDebut: new Date("2019-02-12"),
      estadoGrupo: "ACTIVO",
      idConcepto: conceptoCute.id,
      idConceptoVisual: visualCute.id,
      Nomiembros: 5,
      Agencias: { connect: [{ id: jypEntertainment.id }] }
    }
  })
  const aespa = await prisma.grupo.create({
    data: {
      nombreCompleto: "aespa",
      fechaDebut: new Date("2020-11-17"),
      estadoGrupo: "ACTIVO",
      idConcepto: conceptoFuturista.id,
      idConceptoVisual: visualFuturista.id,
      Nomiembros: 4,
      Agencias: { connect: [{ id: smEntertainment.id }] }
    }
  })
  const redVelvet = await prisma.grupo.create({
    data: {
      nombreCompleto: "Red Velvet",
      fechaDebut: new Date("2014-08-01"),
      estadoGrupo: "ACTIVO",
      idConcepto: conceptoDark.id,
      idConceptoVisual: visualDark.id,
      Nomiembros: 5,
      Agencias: { connect: [{ id: smEntertainment.id }] }
    }
  })
  const seventeen = await prisma.grupo.create({
    data: {
      nombreCompleto: "SEVENTEEN",
      fechaDebut: new Date("2015-05-26"),
      estadoGrupo: "ACTIVO",
      idConcepto: conceptoRetro.id,
      idConceptoVisual: visualRetro.id,
      Nomiembros: 13,
      Agencias: { connect: [{ id: pledisEntertainment.id }] }
    }
  })
  console.log('✅ 9 Grupos creados')
//#endregion








  //#region  CREAR APRENDICES
  console.log('🎓 Creando aprendices...')
  const aprendiz1 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Kim Minju",
      fechaNacimiento: new Date("2001-02-05"),
      edad: 23,
      nivelEntrenamiento: 3
    }
  })
  const aprendiz2 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Park Jisung",
      fechaNacimiento: new Date("2002-02-05"),
      edad: 22,
      nivelEntrenamiento: 2
    }
  })
  const aprendiz3 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Lee Chaeryeong",
      fechaNacimiento: new Date("2001-06-05"),
      edad: 23,
      nivelEntrenamiento: 4
    }
  })
  const aprendiz4 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Choi Yeonjun",
      fechaNacimiento: new Date("1999-09-13"),
      edad: 25,
      nivelEntrenamiento: 5
    }
  })
  const aprendiz5 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Hwang Yeji",
      fechaNacimiento: new Date("2000-05-26"),
      edad: 24,
      nivelEntrenamiento: 5
    }
  })
  const aprendiz6 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Yoo Jimin (Karina)",
      fechaNacimiento: new Date("2000-04-11"),
      edad: 24,
      nivelEntrenamiento: 5
    }
  })
  const aprendiz7 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Jung Somin",
      fechaNacimiento: new Date("2003-08-15"),
      edad: 21,
      nivelEntrenamiento: 2
    }
  })
  const aprendiz8 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Lee Minho",
      fechaNacimiento: new Date("2002-10-25"),
      edad: 22,
      nivelEntrenamiento: 3
    }
  })
  const aprendiz9 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Bae Joohyun (Irene)",
      fechaNacimiento: new Date("1991-03-29"),
      edad: 33,
      nivelEntrenamiento: 5
    }
  })
  const aprendiz10 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Choi Seungcheol (S.Coups)",
      fechaNacimiento: new Date("1995-08-08"),
      edad: 29,
      nivelEntrenamiento: 5
    }
  })
  const aprendiz11 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Kim Taehyung (V)",
      fechaNacimiento: new Date("1995-12-30"),
      edad: 28,
      nivelEntrenamiento: 5
    }
  })
  const aprendiz12 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Park Chaeyoung (Rosé)",
      fechaNacimiento: new Date("1997-02-11"),
      edad: 27,
      nivelEntrenamiento: 5
    }
  })
  const aprendiz13 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Heug Min Son",
      fechaNacimiento: new Date("1997-02-11"),
      edad: 27,
      nivelEntrenamiento: 5
    }
  })
  const aprendiz14 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Agustin",
      fechaNacimiento: new Date("1997-02-11"),
      edad: 27,
      nivelEntrenamiento: 7
    }
  })
  const aprendiz15 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Ronald",
      fechaNacimiento: new Date("1997-02-11"),
      edad: 27,
      nivelEntrenamiento: 6
    }
  })
  const aprendiz16 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Dylan",
      fechaNacimiento: new Date("1997-02-11"),
      edad: 27,
      nivelEntrenamiento: 9
    }
  })

  const nuevosAprendicesData = [
    { nombreCompleto: "Kim Jiwon", fechaNacimiento: new Date("2004-03-14"), edad: 19, nivelEntrenamiento: 1 },
    { nombreCompleto: "Lee Haerin", fechaNacimiento: new Date("2003-07-22"), edad: 20, nivelEntrenamiento: 2 },
    { nombreCompleto: "Park Seojun", fechaNacimiento: new Date("2002-05-30"), edad: 21, nivelEntrenamiento: 3 },
    { nombreCompleto: "Choi Haeun", fechaNacimiento: new Date("2001-11-12"), edad: 22, nivelEntrenamiento: 4 },
    { nombreCompleto: "Yoon Minseok", fechaNacimiento: new Date("2000-08-09"), edad: 23, nivelEntrenamiento: 5 },
    { nombreCompleto: "Han Soojin", fechaNacimiento: new Date("2001-02-18"), edad: 22, nivelEntrenamiento: 4 },
    { nombreCompleto: "Lee Kyungsoo", fechaNacimiento: new Date("1999-12-25"), edad: 24, nivelEntrenamiento: 5 },
    { nombreCompleto: "Kim Yerin", fechaNacimiento: new Date("2002-01-07"), edad: 21, nivelEntrenamiento: 3 },
    { nombreCompleto: "Jung Taemin", fechaNacimiento: new Date("2000-04-20"), edad: 23, nivelEntrenamiento: 5 },
    { nombreCompleto: "Park Hyunjin", fechaNacimiento: new Date("2001-06-15"), edad: 22, nivelEntrenamiento: 4 },
    { nombreCompleto: "Lee Sunwoo", fechaNacimiento: new Date("2003-09-10"), edad: 20, nivelEntrenamiento: 2 },
    { nombreCompleto: "Choi Jieun", fechaNacimiento: new Date("2004-12-05"), edad: 19, nivelEntrenamiento: 1 },
    { nombreCompleto: "Yoo Seohyun", fechaNacimiento: new Date("2002-11-21"), edad: 21, nivelEntrenamiento: 3 },
    { nombreCompleto: "Kim Minseok", fechaNacimiento: new Date("2000-03-12"), edad: 23, nivelEntrenamiento: 5 },
    { nombreCompleto: "Lee Nayeon", fechaNacimiento: new Date("2001-08-17"), edad: 22, nivelEntrenamiento: 4 },
    { nombreCompleto: "Park Jihoon", fechaNacimiento: new Date("2003-05-25"), edad: 20, nivelEntrenamiento: 2 },
    { nombreCompleto: "Choi Mina", fechaNacimiento: new Date("2004-10-09"), edad: 19, nivelEntrenamiento: 1 },
    { nombreCompleto: "Han Donghyun", fechaNacimiento: new Date("2002-02-27"), edad: 21, nivelEntrenamiento: 3 },
    { nombreCompleto: "Lee Jihwan", fechaNacimiento: new Date("2001-07-30"), edad: 22, nivelEntrenamiento: 4 },
    { nombreCompleto: "Kim Soobin", fechaNacimiento: new Date("2000-12-12"), edad: 23, nivelEntrenamiento: 5 },
    { nombreCompleto: "Park Seulgi", fechaNacimiento: new Date("2003-03-03"), edad: 20, nivelEntrenamiento: 2 },
    { nombreCompleto: "Choi Junsu", fechaNacimiento: new Date("2004-06-18"), edad: 19, nivelEntrenamiento: 1 },
    { nombreCompleto: "Lee Haechan", fechaNacimiento: new Date("2002-09-22"), edad: 21, nivelEntrenamiento: 3 },
    { nombreCompleto: "Yoon Dahyun", fechaNacimiento: new Date("2001-11-05"), edad: 22, nivelEntrenamiento: 4 },
  ];
  
  const nuevosAprendices: any[] = [];
  for (const a of nuevosAprendicesData) {
    const ap = await prisma.aprendiz.create({
      data: {
        nombreCompleto: a.nombreCompleto,
        fechaNacimiento: a.fechaNacimiento,
        edad: a.edad,
        nivelEntrenamiento: a.nivelEntrenamiento,
      }
    });
    nuevosAprendices.push(ap);
  }
  
  console.log('✅ 40 Aprendices creados');
//#endregion









  //#region  APRENDICES EN AGENCIA
  console.log('🏢 Asignando aprendices a agencias...')
  await prisma.aprendizEnAgencia.createMany({
    data: [
      { idAp: aprendiz1.id, idAg: smEntertainment.id, fechaInicio: new Date("2019-01-15"), estado: "EN ENTRENAMIENTO" },
      { idAp: aprendiz2.id, idAg: ygEntertainment.id, fechaInicio: new Date("2018-06-20"), estado: "EN ENTRENAMIENTO" },
      { idAp: aprendiz3.id, idAg: jypEntertainment.id, fechaInicio: new Date("2017-03-10"), estado: "ARTISTA" },
      { idAp: aprendiz4.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2016-05-01"), fechaFinalizacion: new Date("2019-03-04"), estado: "ARTISTA" },
      { idAp: aprendiz5.id, idAg: jypEntertainment.id, fechaInicio: new Date("2017-08-15"), fechaFinalizacion: new Date("2019-02-12"), estado: "ARTISTA" },
      { idAp: aprendiz6.id, idAg: smEntertainment.id, fechaInicio: new Date("2016-09-01"), fechaFinalizacion: new Date("2020-11-17"), estado: "ARTISTA"},
      { idAp: aprendiz7.id, idAg: starshipEntertainment.id, fechaInicio: new Date("2021-07-10"), estado: "EN ENTRENAMIENTO" },
      { idAp: aprendiz8.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2020-11-05"), estado: "EN ENTRENAMIENTO" },
      { idAp: aprendiz9.id, idAg: smEntertainment.id, fechaInicio: new Date("2009-03-20"), fechaFinalizacion: new Date("2014-08-01"), estado: "ARTISTA" },
      { idAp: aprendiz10.id, idAg: pledisEntertainment.id, fechaInicio: new Date("2010-05-15"), fechaFinalizacion: new Date("2015-05-26"), estado: "ARTISTA" },
      { idAp: aprendiz11.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2011-06-13"), fechaFinalizacion: new Date("2013-06-13"), estado: "ARTISTA" },
      { idAp: aprendiz12.id, idAg: ygEntertainment.id, fechaInicio: new Date("2012-08-08"), fechaFinalizacion: new Date("2016-08-08"), estado: "ARTISTA" },
      { idAp: aprendiz13.id, idAg: ygEntertainment.id, fechaInicio: new Date("2012-08-08"), fechaFinalizacion: new Date("2016-08-08"), estado: "EN PROCESO DE SELECCION" },
      { idAp: aprendiz14.id, idAg: ygEntertainment.id, fechaInicio: new Date("2012-08-08"), fechaFinalizacion: new Date("2016-08-08"), estado: "EN PROCESO DE SELECCION" },
      { idAp: aprendiz15.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2012-08-08"), fechaFinalizacion: new Date("2016-08-08"), estado: "EN PROCESO DE SELECCION" }, 
      { idAp: aprendiz16.id, idAg: ygEntertainment.id, fechaInicio: new Date("2012-08-08"), fechaFinalizacion: new Date("2016-08-08"), estado: "EN ENTRENAMIENTO" }, 

    ]
  })
  console.log('✅ Aprendices asignados a agencias')

  // Asociar aprendices a agencias y viceversa para que los arrays se vean en Prisma Studio
  const aprendizEnAgencia = [
    { idAp: aprendiz1.id, idAg: smEntertainment.id, fechaInicio: new Date("2019-01-15") },
    { idAp: aprendiz2.id, idAg: ygEntertainment.id, fechaInicio: new Date("2018-06-20") },
    { idAp: aprendiz3.id, idAg: jypEntertainment.id, fechaInicio: new Date("2017-03-10") },
    { idAp: aprendiz4.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2016-05-01") },
    { idAp: aprendiz5.id, idAg: jypEntertainment.id, fechaInicio: new Date("2017-08-15") },
    { idAp: aprendiz6.id, idAg: smEntertainment.id, fechaInicio: new Date("2016-09-01") },
    { idAp: aprendiz7.id, idAg: starshipEntertainment.id, fechaInicio: new Date("2021-07-10") },
    { idAp: aprendiz8.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2020-11-05") },
    { idAp: aprendiz9.id, idAg: smEntertainment.id, fechaInicio: new Date("2009-03-20") },
    { idAp: aprendiz10.id, idAg: pledisEntertainment.id, fechaInicio: new Date("2010-05-15") },
    { idAp: aprendiz11.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2011-06-13") },
    { idAp: aprendiz12.id, idAg: ygEntertainment.id, fechaInicio: new Date("2012-08-08") }
  ];
  for (const { idAp, idAg, fechaInicio } of aprendizEnAgencia) {
    await prisma.aprendiz.update({
      where: { id: idAp },
      data: {
        Agencia: {
          connect: { idAp_idAg_fechaInicio: { idAp, idAg, fechaInicio } }
        }
      }
    });
    await prisma.agencia.update({
      where: { id: idAg },
      data: {
        Aprendices: {
          connect: { idAp_idAg_fechaInicio: { idAp, idAg, fechaInicio } }
        }
      }
    });
  }

  //#endregion









  //#region  EVALUACIONES DE APRENDICES
  console.log('📊 Creando evaluaciones de aprendices...')
  await prisma.evaluacionAprendiz.createMany({
    data: [
      { idAp: aprendiz1.id, idAg: smEntertainment.id, fechaEvaluacion: new Date("2023-01-15"), evaluacion: 8 },
      { idAp: aprendiz1.id, idAg: smEntertainment.id, fechaEvaluacion: new Date("2023-06-15"), evaluacion: 9 },
      { idAp: aprendiz2.id, idAg: ygEntertainment.id, fechaEvaluacion: new Date("2023-02-20"), evaluacion: 7 },
      { idAp: aprendiz2.id, idAg: ygEntertainment.id, fechaEvaluacion: new Date("2023-08-20"), evaluacion: 8 },
      { idAp: aprendiz3.id, idAg: jypEntertainment.id, fechaEvaluacion: new Date("2023-03-10"), evaluacion: 9 },
      { idAp: aprendiz3.id, idAg: jypEntertainment.id, fechaEvaluacion: new Date("2023-09-10"), evaluacion: 9 },
      { idAp: aprendiz7.id, idAg: starshipEntertainment.id, fechaEvaluacion: new Date("2023-07-10"), evaluacion: 6 },
      { idAp: aprendiz7.id, idAg: starshipEntertainment.id, fechaEvaluacion: new Date("2024-01-10"), evaluacion: 7 },
      { idAp: aprendiz8.id, idAg: hibeEntertainment.id, fechaEvaluacion: new Date("2023-11-05"), evaluacion: 7 },
      { idAp: aprendiz8.id, idAg: hibeEntertainment.id, fechaEvaluacion: new Date("2024-05-05"), evaluacion: 8 }
    ]
  })
  console.log('✅ Evaluaciones de aprendices creadas')

//#endregion









    //#region  CREAR ARTISTAS
    console.log('🌟 Creando artistas...')
    const artista1 = await prisma.artista.create({
      data: {
        idAp: aprendiz4.id,
        idGr: nct127.id,
        nombreArtistico: "Taeyong",
        fechaDebut: new Date("2016-07-07"),
        estadoArtista: "EN PAUSA"
      }
    })
    const artista2 = await prisma.artista.create({
      data: {
        idAp: aprendiz12.id,
        idGr: blackpink.id,
        nombreArtistico: "Rosé",
        fechaDebut: new Date("2016-08-08"),
        estadoArtista: "ACTIVO"
      }
    })
    const artista3 = await prisma.artista.create({
      data: {
        idAp: aprendiz3.id,
        idGr: twice.id,
        nombreArtistico: "Chaeyoung",
        fechaDebut: new Date("2015-10-20"),
        estadoArtista: "ACTIVO"
      }
    })
    const artista4 = await prisma.artista.create({
      data: {
        idAp: aprendiz11.id,
        idGr: bts.id,
        nombreArtistico: "V",
        fechaDebut: new Date("2013-06-13"),
        estadoArtista: "EN PAUSA"
      }
    })
    const artista5 = await prisma.artista.create({
      data: {
        idAp: aprendiz5.id,
        idGr: itzy.id,
        nombreArtistico: "Yeji",
        fechaDebut: new Date("2019-02-12"),
        estadoArtista: "ACTIVO"
      }
    })
    const artista6 = await prisma.artista.create({
      data: {
        idAp: aprendiz6.id,
        idGr: aespa.id,
        nombreArtistico: "Karina",
        fechaDebut: new Date("2020-11-17"),
        estadoArtista: "ACTIVO"
      }
    })
    const artista7 = await prisma.artista.create({
      data: {
        idAp: aprendiz9.id,
        idGr: redVelvet.id,
        nombreArtistico: "Irene",
        fechaDebut: new Date("2014-08-01"),
        estadoArtista: "ACTIVO"
      }
    })
    const artista8 = await prisma.artista.create({
      data: {
        idAp: aprendiz10.id,
        idGr: seventeen.id,
        nombreArtistico: "S.Coups",
        fechaDebut: new Date("2015-05-26"),
        estadoArtista: "EN PAUSA"
      }
    })
    const artista9 = await prisma.artista.create({
      data: {
        idAp: aprendiz14.id,
        idGr: seventeen.id,
        nombreArtistico: "Lil Agus03",
        fechaDebut: new Date("2016-05-09"),
        estadoArtista: "ACTIVO"
      }
    })
    const artista10 = await prisma.artista.create({
      data: {
        idAp: aprendiz15.id,
        idGr: seventeen.id,
        nombreArtistico: "RPV",
        fechaDebut: new Date("2017-12-03"),
        estadoArtista: "EN PAUSA"
      }
    })
    const artista11 = await prisma.artista.create({
      data: {
        idAp: aprendiz16.id,
        idGr: seventeen.id,
        nombreArtistico: "Awa pichi",
        fechaDebut: new Date("2015-10-26"),
        estadoArtista: "ACTIVO"
      }
    })

    const gruposActivos = [nct127, blackpink, twice, bts, itzy, aespa, redVelvet, seventeen];

    // Definimos los artistas con sus grupos y fechas de debut
    const artistasNuevosData = [
      { aprendiz: nuevosAprendices[0], grupo: nct127, nombreArtistico: "MINJU", fechaDebut: new Date("2023-01-15"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[1], grupo: nct127, nombreArtistico: "HAERIN", fechaDebut: new Date("2023-02-01"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[2], grupo: blackpink, nombreArtistico: "SEOJUN", fechaDebut: new Date("2023-03-01"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[3], grupo: blackpink, nombreArtistico: "HAEUN", fechaDebut: new Date("2023-03-20"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[4], grupo: twice, nombreArtistico: "MINSEOK", fechaDebut: new Date("2023-04-05"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[5], grupo: twice, nombreArtistico: "SOOJIN", fechaDebut: new Date("2023-04-18"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[6], grupo: bts, nombreArtistico: "MINHO", fechaDebut: new Date("2023-05-01"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[7], grupo: bts, nombreArtistico: "JIWON", fechaDebut: new Date("2023-05-12"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[8], grupo: itzy, nombreArtistico: "KYUNGSOO", fechaDebut: new Date("2023-06-01"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[9], grupo: itzy, nombreArtistico: "YERIN", fechaDebut: new Date("2023-06-15"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[10], grupo: aespa, nombreArtistico: "TAEMIN", fechaDebut: new Date("2023-07-01"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[11], grupo: aespa, nombreArtistico: "HYUNJIN", fechaDebut: new Date("2023-07-20"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[12], grupo: redVelvet, nombreArtistico: "SUNWOO", fechaDebut: new Date("2023-08-01"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[13], grupo: redVelvet, nombreArtistico: "JIEUN", fechaDebut: new Date("2023-08-18"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[14], grupo: seventeen, nombreArtistico: "SEOHYUN", fechaDebut: new Date("2023-09-01"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[15], grupo: seventeen, nombreArtistico: "MINSEOK2", fechaDebut: new Date("2023-09-15"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[16], grupo: nct127, nombreArtistico: "NAYEON", fechaDebut: new Date("2023-10-01"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[17], grupo: nct127, nombreArtistico: "JIHOON", fechaDebut: new Date("2023-10-20"), estadoArtista: "ACTIVO" },
      { aprendiz: nuevosAprendices[18], grupo: blackpink, nombreArtistico: "MINA", fechaDebut: new Date("2023-11-01"), estadoArtista: "INACTIVO" },
      { aprendiz: nuevosAprendices[19], grupo: blackpink, nombreArtistico: "DONGHYUN", fechaDebut: new Date("2023-11-15"), estadoArtista: "INACTIVO" },
      { aprendiz: nuevosAprendices[20], grupo: twice, nombreArtistico: "JIHWAN", fechaDebut: new Date("2023-12-01"), estadoArtista: "INACTIVO" },
      { aprendiz: nuevosAprendices[21], grupo: twice, nombreArtistico: "SOOBIN", fechaDebut: new Date("2023-12-12"), estadoArtista: "INACTIVO" },
      { aprendiz: nuevosAprendices[22], grupo: itzy, nombreArtistico: "SEULGI", fechaDebut: new Date("2024-01-01"), estadoArtista: "INACTIVO" },
      { aprendiz: nuevosAprendices[23], grupo: itzy, nombreArtistico: "JUNSU", fechaDebut: new Date("2024-01-15"), estadoArtista: "INACTIVO" },
    ];

    // Creamos los artistas con Prisma
    for (const a of artistasNuevosData) {
      await prisma.artista.create({
        data: {
          idAp: a.aprendiz.id,
          idGr: a.grupo.id,
          nombreArtistico: a.nombreArtistico,
          fechaDebut: a.fechaDebut,
          estadoArtista: a.estadoArtista
        }
      });
    }
    console.log('✅ 40 Artistas creados')
//#endregion









  //#region  CONTRATOS INDIVIDUALES
  console.log('📝 Creando contratos individuales...')
  await prisma.contrato.createMany({
    data: [
      {
        idAg: smEntertainment.id,
        idAp: artista1.idAp,
        idGr: artista1.idGr,
        fechaInicio: new Date("2016-07-01"),
        fechaFinalizacion: new Date("2027-09-02"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato estándar por 7 años con cláusulas de renovación",
        distribucionIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: ygEntertainment.id,
        idAp: artista2.idAp,
        idGr: artista2.idGr,
        fechaInicio: new Date("2016-08-01"),
        fechaFinalizacion: new Date("2024-01-13"),
        estado: "FINALIZADO",
        condicionesIniciales: "Contrato exclusivo por 5 años con opción de extensión",
        distribucionIngresos: "60% agencia, 40% artista"
      },
      {
        idAg: jypEntertainment.id,
        idAp: artista3.idAp,
        idGr: artista3.idGr,
        fechaInicio: new Date("2015-10-01"),
        fechaFinalizacion: new Date("2024-08-21"),
        estado: "FINALIZADO",
        condicionesIniciales: "Contrato por 7 años con opción de renovación",
        distribucionIngresos: "65% agencia, 35% artista"
      },
      {
        idAg: hibeEntertainment.id,
        idAp: artista4.idAp,
        idGr: artista4.idGr,
        fechaInicio: new Date("2013-06-01"),
        fechaFinalizacion: new Date("2030-08-21"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato por 7 años con distribución equitativa",
        distribucionIngresos: "50% agencia, 50% artista"
      },
      {
        idAg: jypEntertainment.id,
        idAp: artista5.idAp,
        idGr: artista5.idGr,
        fechaInicio: new Date("2019-02-01"),
        fechaFinalizacion: new Date("2021-09-02"),
        estado: "FINALIZADO",
        condicionesIniciales: "Contrato por 7 años estándar",
        distribucionIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: smEntertainment.id,
        idAp: artista6.idAp,
        idGr: artista6.idGr,
        fechaInicio: new Date("2020-11-01"),
        fechaFinalizacion: new Date("2022-09-02"),
        estado: "FINALIZADO",
        condicionesIniciales: "Contrato por 7 años con cláusulas especiales",
        distribucionIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: smEntertainment.id,
        idAp: artista7.idAp,
        idGr: artista7.idGr,
        fechaInicio: new Date("2014-08-01"),
        fechaFinalizacion: new Date("2029-08-30"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato por 7 años renovado en 2021",
        distribucionIngresos: "60% agencia, 40% artista"
      },
      {
        idAg: pledisEntertainment.id,
        idAp: artista8.idAp,
        idGr: artista8.idGr,
        fechaInicio: new Date("2015-05-26"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato por 7 años con términos flexibles",
        distribucionIngresos: "55% agencia, 45% artista"
      }
    ]
  })


  await prisma.contrato.createMany({
    data: [
      // ===== ARTISTAS ACTIVOS =====
      {
        idAg: smEntertainment.id,
        idAp: Number(artistasNuevosData[0]!.aprendiz.id), // MINJU - NCT127
        idGr: artistasNuevosData[0]!.grupo.id,
        fechaInicio: new Date("2023-01-15"),
        fechaFinalizacion: new Date("2030-01-14"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato debut por 7 años con opción a renovación automática",
        distribucionIngresos: "65% agencia, 35% artista"
      },
      {
        idAg: smEntertainment.id,
        idAp: Number(artistasNuevosData[1]!.aprendiz.id), // HAERIN - NCT127
        idGr: artistasNuevosData[1]!.grupo.id,
        fechaInicio: new Date("2023-02-01"),
        fechaFinalizacion: new Date("2029-02-01"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato estándar idol trainee → artista",
        distribucionIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: ygEntertainment.id,
        idAp: Number(artistasNuevosData[2]!.aprendiz.id), // SEOJUN - BLACKPINK
        idGr: artistasNuevosData[2]!.grupo.id,
        fechaInicio: new Date("2023-03-01"),
        fechaFinalizacion: new Date("2030-03-01"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato exclusivo con enfoque internacional",
        distribucionIngresos: "60% agencia, 40% artista"
      },
      {
        idAg: jypEntertainment.id,
        idAp: Number(artistasNuevosData[4]!.aprendiz.id), // MINSEOK - TWICE
        idGr: artistasNuevosData[4]!.grupo.id,
        fechaInicio: new Date("2023-04-05"),
        fechaFinalizacion: new Date("2028-04-05"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato de grupo.id con cláusula de actividades en solitario",
        distribucionIngresos: "65% agencia, 35% artista"
      },
      {
        idAg: hibeEntertainment.id,
        idAp: Number(artistasNuevosData[6]!.aprendiz.id), // MINHO - BTS
        idGr: artistasNuevosData[6]!.grupo.id,
        fechaInicio: new Date("2023-05-01"),
        fechaFinalizacion: new Date("2032-05-01"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato premium con enfoque global",
        distribucionIngresos: "50% agencia, 50% artista"
      },
     
  
      // ===== CONTRATOS PENDIENTES =====
  
      {
        idAg: smEntertainment.id,
        idAp: Number(artistasNuevosData[8]!.aprendiz.id), // KYUNGSOO - ITZY
        idGr: artistasNuevosData[8]!.grupo.id,
        fechaInicio: new Date("2023-06-01"),
        fechaFinalizacion: new Date("2030-06-01"),
        estado: "PENDIENTE",
        condicionesIniciales: "Contrato enviado, pendiente de firma del artista",
        distribucionIngresos: "65% agencia, 35% artista"
      },
      {
        idAg: smEntertainment.id,
        idAp: Number(artistasNuevosData[10]!.aprendiz.id), // TAEMIN - AESPA
        idGr: artistasNuevosData[10]!.grupo.id,
        fechaInicio: new Date("2023-07-01"),
        fechaFinalizacion: new Date("2029-07-01"),
        estado: "PENDIENTE",
        condicionesIniciales: "Contrato sujeto a revisión legal",
        distribucionIngresos: "60% agencia, 40% artista"
      },
  
      // ===== CONTRATOS RESCINDIDOS =====
  
      {
        idAg: ygEntertainment.id,
        idAp: Number(artistasNuevosData[18]!.aprendiz.id), // MINA - BLACKPINK (INACTIVO)
        idGr: artistasNuevosData[18]!.grupo.id,
        fechaInicio: new Date("2023-11-01"),
        fechaFinalizacion: new Date("2024-06-01"),
        estado: "RESCINDIDO",
        condicionesIniciales: "Contrato rescindido por incumplimiento de agenda",
        distribucionIngresos: "60% agencia, 40% artista"
      },
      {
        idAg: jypEntertainment.id,
        idAp: Number(artistasNuevosData[20]!.aprendiz.id), // JIHWAN - TWICE (INACTIVO)
        idGr: artistasNuevosData[20]!.grupo.id,
        fechaInicio: new Date("2023-12-01"),
        fechaFinalizacion: new Date("2024-03-01"),
        estado: "RESCINDIDO",
        condicionesIniciales: "Rescisión anticipada por decisión mutua",
        distribucionIngresos: "65% agencia, 35% artista"
      },
  
      // ===== CONTRATOS FINALIZADOS =====
  
      {
        idAg: smEntertainment.id,
        idAp: Number(artistasNuevosData[22]!.aprendiz.id), // SEULGI - ITZY
        idGr: artistasNuevosData[22]!.grupo.id,
        fechaInicio: new Date("2024-01-01"),
        fechaFinalizacion: new Date("2024-12-31"),
        estado: "FINALIZADO",
        condicionesIniciales: "Contrato temporal por proyecto especial",
        distribucionIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: pledisEntertainment.id,
        idAp: Number(artistasNuevosData[23]!.aprendiz.id), // JUNSU - ITZY
        idGr: artistasNuevosData[23]!.grupo.id,
        fechaInicio: new Date("2024-01-15"),
        fechaFinalizacion: new Date("2024-10-15"),
        estado: "FINALIZADO",
        condicionesIniciales: "Contrato corto para promoción experimental",
        distribucionIngresos: "55% agencia, 45% artista"
      },
      //miossss
      {
        idAg: hibeEntertainment.id,
        idAp: 33, 
        idGr: 2,
        fechaInicio: new Date("2024-09-02"),
        fechaFinalizacion: new Date("2030-09-02"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato premium con enfoque global para artista especial",
        distribucionIngresos: "50% agencia, 50% artista"
      }
    ]
  });
  console.log('✅ Contratos individuales creados')
//#endregion



  //#region  GRUPO DISUELTO CON ARTISTAS SOLISTAS
  console.log('👥 Creando grupo disuelto con artistas solistas...')
  const grupoDisuelto = await prisma.grupo.create({
    data: {
      nombreCompleto: "Echo Legacy",
      fechaDebut: new Date("2018-03-15"),
      estadoGrupo: "INACTIVO",
      idConcepto: conceptoFantasia.id,
      idConceptoVisual: visualFantasia.id,
      Nomiembros: 3,
      Agencias: { connect: [{ id: cubeEntertainment.id }] }
    }
  })

  // Crear aprendices para el grupo disuelto
  const aprendizEchoLegacy1 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Yuki Yamamoto",
      fechaNacimiento: new Date("1999-07-15"),
      edad: 26,
      nivelEntrenamiento: 8
    }
  })
  const aprendizEchoLegacy2 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Joon Park",
      fechaNacimiento: new Date("2000-02-28"),
      edad: 25,
      nivelEntrenamiento: 7
    }
  })
  const aprendizEchoLegacy3 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Lin Chen",
      fechaNacimiento: new Date("2001-11-10"),
      edad: 24,
      nivelEntrenamiento: 6
    }
  })

  // Asignar aprendices a la agencia antes de convertirse en artistas
  await prisma.aprendizEnAgencia.createMany({
    data: [
      { idAp: aprendizEchoLegacy1.id, idAg: cubeEntertainment.id, fechaInicio: new Date("2018-01-01"), fechaFinalizacion: new Date("2018-03-15"), estado: "ARTISTA" },
      { idAp: aprendizEchoLegacy2.id, idAg: cubeEntertainment.id, fechaInicio: new Date("2018-01-01"), fechaFinalizacion: new Date("2018-03-15"), estado: "ARTISTA" },
      { idAp: aprendizEchoLegacy3.id, idAg: cubeEntertainment.id, fechaInicio: new Date("2018-01-01"), fechaFinalizacion: new Date("2018-03-15"), estado: "ARTISTA" }
    ]
  })

  // Crear artistas que fueron miembros del grupo Echo Legacy
  const artistaEchoLegacy1 = await prisma.artista.create({
    data: {
      idAp: aprendizEchoLegacy1.id,
      idGr: grupoDisuelto.id,
      nombreArtistico: "Yuki",
      fechaDebut: new Date("2018-03-15"),
      estadoArtista: "ACTIVO"
    }
  })
  const artistaEchoLegacy2 = await prisma.artista.create({
    data: {
      idAp: aprendizEchoLegacy2.id,
      idGr: grupoDisuelto.id,
      nombreArtistico: "Joon",
      fechaDebut: new Date("2018-03-15"),
      estadoArtista: "ACTIVO"
    }
  })
  const artistaEchoLegacy3 = await prisma.artista.create({
    data: {
      idAp: aprendizEchoLegacy3.id,
      idGr: grupoDisuelto.id,
      nombreArtistico: "Lin",
      fechaDebut: new Date("2018-03-15"),
      estadoArtista: "ACTIVO"
    }
  })

  // Crear historial: artistas en Echo Legacy (ahora disuelto)
  await prisma.artistaEnGrupo.createMany({
    data: [
      {
        idAp: artistaEchoLegacy1.idAp,
        idGrupoDebut: grupoDisuelto.id,
        idGr: grupoDisuelto.id,
        fechaInicio: new Date("2018-03-15"),
        fechaFinalizacion: new Date("2024-05-20"), // Grupo se disolvió
        rol: "LIDER"
      },
      {
        idAp: artistaEchoLegacy2.idAp,
        idGrupoDebut: grupoDisuelto.id,
        idGr: grupoDisuelto.id,
        fechaInicio: new Date("2018-03-15"),
        fechaFinalizacion: new Date("2024-05-20"),
        rol: "VOCALISTA"
      },
      {
        idAp: artistaEchoLegacy3.idAp,
        idGrupoDebut: grupoDisuelto.id,
        idGr: grupoDisuelto.id,
        fechaInicio: new Date("2018-03-15"),
        fechaFinalizacion: new Date("2024-05-20"),
        rol: "BAILARIN"
      }
    ]
  })

  // Crear contratos activos para los artistas solistas (ya no en grupo)
  await prisma.contrato.createMany({
    data: [
      {
        idAg: cubeEntertainment.id,
        idAp: artistaEchoLegacy1.idAp,
        idGr: grupoDisuelto.id,
        fechaInicio: new Date("2024-06-01"),
        fechaFinalizacion: new Date("2030-06-01"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato de solista como artista independiente, 3 años renovables",
        distribucionIngresos: "60% agencia, 40% artista"
      },
      {
        idAg: cubeEntertainment.id,
        idAp: artistaEchoLegacy2.idAp,
        idGr: grupoDisuelto.id,
        fechaInicio: new Date("2024-06-01"),
        fechaFinalizacion: new Date("2030-06-01"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato de solista como artista independiente, 3 años renovables",
        distribucionIngresos: "60% agencia, 40% artista"
      },
      {
        idAg: cubeEntertainment.id,
        idAp: artistaEchoLegacy3.idAp,
        idGr: grupoDisuelto.id,
        fechaInicio: new Date("2024-06-01"),
        fechaFinalizacion: new Date("2030-06-01"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato de solista como artista independiente, 3 años renovables",
        distribucionIngresos: "60% agencia, 40% artista"
      }
    ]
  })

  console.log('✅ Grupo disuelto (Echo Legacy) y 3 artistas solistas con contratos activos creados')
  
  // Actualizar arrays directos para aprendices en agencia (Echo Legacy)
  const aprendizEchoEnAgencia = [
    { idAp: aprendizEchoLegacy1.id, idAg: cubeEntertainment.id, fechaInicio: new Date("2018-01-01") },
    { idAp: aprendizEchoLegacy2.id, idAg: cubeEntertainment.id, fechaInicio: new Date("2018-01-01") },
    { idAp: aprendizEchoLegacy3.id, idAg: cubeEntertainment.id, fechaInicio: new Date("2018-01-01") }
  ];
  for (const { idAp, idAg, fechaInicio } of aprendizEchoEnAgencia) {
    await prisma.aprendiz.update({
      where: { id: idAp },
      data: {
        Agencia: {
          connect: { idAp_idAg_fechaInicio: { idAp, idAg, fechaInicio } }
        }
      }
    });
    await prisma.agencia.update({
      where: { id: idAg },
      data: {
        Aprendices: {
          connect: { idAp_idAg_fechaInicio: { idAp, idAg, fechaInicio } }
        }
      }
    });
  }

  // Actualizar grupo con agencia en ambas direcciones
  await prisma.grupo.update({
    where: { id: grupoDisuelto.id },
    data: {
      Agencias: {
        connect: { id: cubeEntertainment.id }
      }
    }
  });
  await prisma.agencia.update({
    where: { id: cubeEntertainment.id },
    data: {
      Grupos: {
        connect: { id: grupoDisuelto.id }
      }
    }
  });

//#endregion













  //#region  CONTRATOS DE GRUPO
  console.log('📋 Creando contratos de grupo...')
  await prisma.contratoGrupo.createMany({
    data: [
      {
        idAg: smEntertainment.id,
        IdGr: nct127.id,
        fechaInicio: new Date("2016-07-01"),
        fechaFinalizacion: new Date("2029-12-17"),

        estado: "FINALIZADO",
        condicionesIniciales: "Contrato de grupo por 7 años con actividades conjuntas",
        distribucionIngresos: "50% agencia, 50% grupo"
      },
      {
        idAg: ygEntertainment.id,
        IdGr: blackpink.id,
        fechaInicio: new Date("2016-08-01"),
        fechaFinalizacion: new Date("2025-12-18"),

        estado: "ACTIVO",
        condicionesIniciales: "Contrato de grupo por 5 años renovado en 2021",
        distribucionIngresos: "45% agencia, 55% grupo"
      },
      {
        idAg: jypEntertainment.id,
        IdGr: twice.id,
        fechaInicio: new Date("2015-10-01"),
        fechaFinalizacion: new Date("2029-12-30"),
        
        estado: "ACTIVO",
        condicionesIniciales: "Contrato de grupo por 7 años con extensión",
        distribucionIngresos: "50% agencia, 50% grupo"
      },
      {
        idAg: hibeEntertainment.id,
        IdGr: bts.id,
        fechaInicio: new Date("2013-06-01"),
        fechaFinalizacion: new Date("2029-11-03"),

        estado: "ACTIVO",
        condicionesIniciales: "Contrato de grupo por 7 años con términos favorables",
        distribucionIngresos: "40% agencia, 60% grupo"
      },
      {
        idAg: jypEntertainment.id,
        IdGr: itzy.id,
        fechaInicio: new Date("2019-02-01"),
        fechaFinalizacion: new Date("2034-08-30"),

        estado: "ACTIVO",
        condicionesIniciales: "Contrato de grupo por 7 años inicial",
        distribucionIngresos: "50% agencia, 50% grupo"
      },
      {
        idAg: smEntertainment.id,
        IdGr: aespa.id,
        fechaInicio: new Date("2020-11-01"),
        fechaFinalizacion: new Date("2021-08-30"),

        estado: "FINALIZADO",
        condicionesIniciales: "Contrato de grupo por 7 años con tecnología AI",
        distribucionIngresos: "50% agencia, 50% grupo"
      },
      {
        idAg: smEntertainment.id,
        IdGr: redVelvet.id,
        fechaInicio: new Date("2014-08-01"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato de grupo por 7 años renovado",
        distribucionIngresos: "48% agencia, 52% grupo"
      },
      {
        idAg: pledisEntertainment.id,
        IdGr: seventeen.id,
        fechaInicio: new Date("2015-05-26"),
        estado: "ACTIVO",
        condicionesIniciales: "Contrato de grupo por 7 años con 13 miembros",
        distribucionIngresos: "45% agencia, 55% grupo"
      }
    ]
  })
  console.log('✅ Contratos de grupo creados')
//#endregion









//#region  HISTORIAL DE ARTISTAS EN GRUPOS
console.log('📚 Creando historial de artistas en grupos...')

const ROLES = ["VOCALISTA", "RAPERO", "BAILARIN", "VISUAL"];

const historialArtistas = [
  // ARTISTAS BASE (debut → otros grupos)

  // artista1 – debut NCT127
  {
    idAp: artista1.idAp,
    idGrupoDebut: artista1.idGr, // NCT127
    idGr: nct127.id,
    fechaInicio: new Date("2016-07-07"),
    fechaFinalizacion: null,
    rol: "LIDER"
  },
  {
    idAp: artista1.idAp,
    idGrupoDebut: artista1.idGr,
    idGr: aespa.id,
    fechaInicio: new Date("2019-01-01"),
    fechaFinalizacion: new Date("2020-01-01"),
    rol: "RAPERO"
  },

  // artista2 – debut BLACKPINK
  {
    idAp: artista2.idAp,
    idGrupoDebut: artista2.idGr,
    idGr: blackpink.id,
    fechaInicio: new Date("2016-08-08"),
    fechaFinalizacion: null,
    rol: "VOCALISTA"
  },

  // artista3 – debut TWICE
  {
    idAp: artista3.idAp,
    idGrupoDebut: artista3.idGr,
    idGr: twice.id,
    fechaInicio: new Date("2015-10-20"),
    fechaFinalizacion: null,
    rol: "RAPERA"
  },
  {
    idAp: artista3.idAp,
    idGrupoDebut: artista3.idGr,
    idGr: blackpink.id,
    fechaInicio: new Date("2017-06-01"),
    fechaFinalizacion: new Date("2018-06-01"),
    rol: "VISUAL"
  },

  // artista4 – debut BTS
  {
    idAp: artista4.idAp,
    idGrupoDebut: artista4.idGr,
    idGr: bts.id,
    fechaInicio: new Date("2013-06-13"),
    fechaFinalizacion: null,
    rol: "VOCALISTA"
  },

  // artista5 – debut ITZY
  {
    idAp: artista5.idAp,
    idGrupoDebut: artista5.idGr,
    idGr: itzy.id,
    fechaInicio: new Date("2019-02-12"),
    fechaFinalizacion: null,
    rol: "LIDER"
  },

  // artista6 – debut AESPA
  {
    idAp: artista6.idAp,
    idGrupoDebut: artista6.idGr,
    idGr: aespa.id,
    fechaInicio: new Date("2020-11-17"),
    fechaFinalizacion: null,
    rol: "LIDER"
  },

  // artista7 – debut RED VELVET
  {
    idAp: artista7.idAp,
    idGrupoDebut: artista7.idGr,
    idGr: redVelvet.id,
    fechaInicio: new Date("2014-08-01"),
    fechaFinalizacion: null,
    rol: "VOCALISTA"
  },

  // artista8 – debut SEVENTEEN
  {
    idAp: artista8.idAp,
    idGrupoDebut: artista8.idGr,
    idGr: seventeen.id,
    fechaInicio: new Date("2015-05-26"),
    fechaFinalizacion: null,
    rol: "LIDER"
  },

  // SOLISTAS (terminan en su grupo debut)

  {
    idAp: artista9.idAp,
    idGrupoDebut: artista9.idGr,
    idGr: seventeen.id,
    fechaInicio: new Date("2016-05-09"),
    fechaFinalizacion: new Date("2021-05-01"),
    rol: "SOLISTA"
  },
  {
    idAp: artista10.idAp,
    idGrupoDebut: artista10.idGr,
    idGr: seventeen.id,
    fechaInicio: new Date("2017-12-03"),
    fechaFinalizacion: new Date("2022-01-15"),
    rol: "SOLISTA"
  },
  {
    idAp: artista11.idAp,
    idGrupoDebut: artista11.idGr,
    idGr: seventeen.id,
    fechaInicio: new Date("2015-10-26"),
    fechaFinalizacion: new Date("2020-12-31"),
    rol: "SOLISTA"
  }
]

for (const h of historialArtistas) {
  await prisma.artistaEnGrupo.create({
    data: h
  })
}



const artistasHistorial = await prisma.artista.findMany({
  where: {
    idAp: { gte: 17, lte: 40 }
  },
  orderBy: { idAp: "asc" }
});

const artistasPorGrupo = new Map<number, typeof artistasHistorial>();

for (const a of artistasHistorial) {
  if (!artistasPorGrupo.has(a.idGr)) {
    artistasPorGrupo.set(a.idGr, []);
  }
  artistasPorGrupo.get(a.idGr)!.push(a);
}


for (const [idGr, miembros] of artistasPorGrupo) {

  if (miembros.length < 2) continue;

  // Ordenar por debut
  miembros.sort(
    (a, b) => a.fechaDebut.getTime() - b.fechaDebut.getTime()
  );

  let rolIndex = 0;
  let liderAsignado = false;

  for (let i = 0; i < miembros.length; i++) {
    const a = miembros[i];
    const esLider = !liderAsignado;
    if (esLider) liderAsignado = true;

    const activo = a!.estadoArtista === "ACTIVO";
    const rol = ROLES[rolIndex++ % ROLES.length]


    // LÓGICA DE FECHAS
    const fechaInicio =
      i === 0
        ? a!.fechaDebut
        : new Date(a!.fechaDebut.getTime() + 1000 * 60 * 60 * 24 * 90 * i);

    let fechaFinalizacion: Date | null = null;

    // Inactivos SIEMPRE terminan
    if (!activo) {
      fechaFinalizacion = new Date("2024-01-01");
    }

    // si hay muchos miembros, uno se va antes
    if (miembros.length >= 4 && i === 2 && activo) {
      fechaFinalizacion = new Date("2023-12-01");
    }

    await prisma.artistaEnGrupo.create({
      data: {
        idAp: a!.idAp,
        idGrupoDebut: a!.idGr, 
        idGr: idGr,                   
        fechaInicio,
        fechaFinalizacion,
        rol: esLider ? "LIDER" : !rol ? "MIEMBRO" : rol ,
      }
    });
  }
}

//Actualizar numero de miembros
for (const [idGr] of artistasPorGrupo) {
  const count = await prisma.artistaEnGrupo.count({
    where: {
      idGr,
      fechaFinalizacion: null
    }
  });

  await prisma.grupo.update({
    where: { id: idGr },
    data: { Nomiembros: count }
  });
}
console.log('✅ Historial de artistas creado correctamente')
//#endregion





  //#region  Canciones
  console.log('🎵 Creando canciones...')
  const cancionesNCT = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Kick It", genero: "K-Pop/Hip-Hop", productor: "Dem Jointz", fechaLanzamiento: new Date("2020-03-06"), reproducciones: 120000000 } }),
    prisma.cancion.create({ data: { titulo: "Cherry Bomb", genero: "K-Pop/EDM", productor: "Kenzie", fechaLanzamiento: new Date("2017-06-14"), reproducciones: 95000000 } }),
    prisma.cancion.create({ data: { titulo: "Sticker", genero: "K-Pop/Experimental", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2021-09-17"), reproducciones: 67000000 } }),
    prisma.cancion.create({ data: { titulo: "Limitless", genero: "K-Pop", productor: "Kenzie", fechaLanzamiento: new Date("2017-01-06"), reproducciones: 41000000 } })
  ])

  const cancionesBlackpink = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Lovesick Girls", genero: "K-Pop/Pop", productor: "Teddy Park", fechaLanzamiento: new Date("2020-10-02"), reproducciones: 200000000 } }),
    prisma.cancion.create({ data: { titulo: "How You Like That", genero: "K-Pop/EDM", productor: "Teddy Park", fechaLanzamiento: new Date("2020-06-26"), reproducciones: 180000000 } }),
    prisma.cancion.create({ data: { titulo: "DDU-DU DDU-DU", genero: "K-Pop/Hip-Hop", productor: "Teddy Park", fechaLanzamiento: new Date("2018-06-15"), reproducciones: 250000000 } }),
    prisma.cancion.create({ data: { titulo: "Kill This Love", genero: "K-Pop", productor: "Teddy Park", fechaLanzamiento: new Date("2019-04-05"), reproducciones: 210000000 } })
  ])

  const cancionesTwice = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Scientist", genero: "K-Pop/Disco", productor: "J.Y. Park", fechaLanzamiento: new Date("2021-11-12"), reproducciones: 80000000 } }),
    prisma.cancion.create({ data: { titulo: "Feel Special", genero: "K-Pop/R&B", productor: "Park Jin-young", fechaLanzamiento: new Date("2019-09-23"), reproducciones: 120000000 } }),
    prisma.cancion.create({ data: { titulo: "TT", genero: "K-Pop/Pop", productor: "Black Eyed Pilseung", fechaLanzamiento: new Date("2016-10-24"), reproducciones: 150000000 } }),
    prisma.cancion.create({ data: { titulo: "Fancy", genero: "K-Pop", productor: "Black Eyed Pilseung", fechaLanzamiento: new Date("2019-04-22"), reproducciones: 110000000 } })
  ])

  const cancionesBTS = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Dynamite", genero: "Disco-Pop", productor: "David Stewart", fechaLanzamiento: new Date("2020-08-21"), reproducciones: 300000000 } }),
    prisma.cancion.create({ data: { titulo: "Butter", genero: "Dance-Pop", productor: "Rob Grimaldi", fechaLanzamiento: new Date("2021-05-21"), reproducciones: 250000000 } }),
    prisma.cancion.create({ data: { titulo: "Spring Day", genero: "K-Pop/Ballad", productor: "Pdogg", fechaLanzamiento: new Date("2017-02-13"), reproducciones: 180000000 } }),
    prisma.cancion.create({ data: { titulo: "Boy With Luv", genero: "K-Pop/Pop", productor: "Pdogg", fechaLanzamiento: new Date("2019-04-12"), reproducciones: 220000000 } })
  ])

  const cancionesITZY = await Promise.all([
    prisma.cancion.create({ data: { titulo: "WANNABE", genero: "K-Pop/Dance", productor: "Galactika", fechaLanzamiento: new Date("2020-03-09"), reproducciones: 90000000 } }),
    prisma.cancion.create({ data: { titulo: "DALLA DALLA", genero: "K-Pop/Pop", productor: "Galactika", fechaLanzamiento: new Date("2019-02-12"), reproducciones: 85000000 } }),
    prisma.cancion.create({ data: { titulo: "LOCO", genero: "K-Pop/Hip-Hop", productor: "earattack", fechaLanzamiento: new Date("2021-09-24"), reproducciones: 70000000 } }),
    prisma.cancion.create({ data: { titulo: "Not Shy", genero: "K-Pop", productor: "Kass", fechaLanzamiento: new Date("2020-08-17"), reproducciones: 65000000 } })
  ])

  const cancionesAespa = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Next Level", genero: "K-Pop/EDM", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2021-05-17"), reproducciones: 120000000 } }),
    prisma.cancion.create({ data: { titulo: "Savage", genero: "K-Pop/Experimental", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2021-10-05"), reproducciones: 95000000 } }),
    prisma.cancion.create({ data: { titulo: "Black Mamba", genero: "K-Pop/Trap", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2020-11-17"), reproducciones: 80000000 } }),
    prisma.cancion.create({ data: { titulo: "Girls", genero: "K-Pop", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2022-07-08"), reproducciones: 60000000 } })
  ])

  const cancionesRedVelvet = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Psycho", genero: "K-Pop/R&B", productor: "Andrew Scott", fechaLanzamiento: new Date("2019-12-23"), reproducciones: 90000000 } }),
    prisma.cancion.create({ data: { titulo: "Red Flavor", genero: "K-Pop/Dance", productor: "Kenzie", fechaLanzamiento: new Date("2017-07-09"), reproducciones: 85000000 } }),
    prisma.cancion.create({ data: { titulo: "Bad Boy", genero: "K-Pop/R&B", productor: "The Stereotypes", fechaLanzamiento: new Date("2018-01-29"), reproducciones: 70000000 } }),
    prisma.cancion.create({ data: { titulo: "Peek-A-Boo", genero: "K-Pop", productor: "Moonshine", fechaLanzamiento: new Date("2017-11-17"), reproducciones: 65000000 } })
  ])

  const cancionesSeventeen = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Don't Wanna Cry", genero: "K-Pop/Dance", productor: "Woozi", fechaLanzamiento: new Date("2017-05-22"), reproducciones: 100000000 } }),
    prisma.cancion.create({ data: { titulo: "Very Nice", genero: "K-Pop/Funk", productor: "Bumzu", fechaLanzamiento: new Date("2016-07-04"), reproducciones: 90000000 } }),
    prisma.cancion.create({ data: { titulo: "Left & Right", genero: "K-Pop/Hip-Hop", productor: "Bumzu", fechaLanzamiento: new Date("2020-06-16"), reproducciones: 80000000 } }),
    prisma.cancion.create({ data: { titulo: "Home;Run", genero: "K-Pop", productor: "Woozi", fechaLanzamiento: new Date("2020-10-19"), reproducciones: 75000000 } })
  ])
  console.log('✅ 24 Canciones creadas')
//#endregion









//#region Album
  console.log('💿 Creando álbumes...')
  const albumNCT = await prisma.album.create({
    data: {
      // idGrupo eliminado, relación ahora es por tablas intermedias
      titulo: "Neo Zone",
      fechaLanzamiento: new Date("2020-03-06"),
      productor: "SM Entertainment",
      NoCanciones: 4,
      NoCopiasVendidas: 1500000,
      Canciones: {
        connect: cancionesNCT.map(c => ({ id: c.id }))
      }
    }
  })

  const albumBlackpink = await prisma.album.create({
    data: {
      // idGrupo eliminado, relación ahora es por tablas intermedias
      titulo: "THE ALBUM",
      fechaLanzamiento: new Date("2020-10-02"),
      productor: "YG Entertainment",
      NoCanciones: 8,
      NoCopiasVendidas: 3000000,
      Canciones: {
        connect: cancionesBlackpink.map(c => ({ id: c.id }))
      }
    }
  })

  const albumTwice = await prisma.album.create({
    data: {
      // idGrupo eliminado, relación ahora es por tablas intermedias
      titulo: "Formula of Love: O+T=<3",
      fechaLanzamiento: new Date("2021-11-12"),
      productor: "JYP Entertainment",
      NoCanciones: 17,
      NoCopiasVendidas: 950000,
      Canciones: {
        connect: cancionesTwice.map(c => ({ id: c.id }))
      }
    }
  })

  const albumBTS = await prisma.album.create({
    data: {
      // idGrupo eliminado, relación ahora es por tablas intermedias
      titulo: "BE",
      fechaLanzamiento: new Date("2020-11-20"),
      productor: "Big Hit Entertainment",
      NoCanciones: 8,
      NoCopiasVendidas: 5000000,
      Canciones: {
        connect: cancionesBTS.map(c => ({ id: c.id }))
      }
    }
  })

  const albumITZY = await prisma.album.create({
    data: {
      // idGrupo eliminado, relación ahora es por tablas intermedias
      titulo: "CRAZY IN LOVE",
      fechaLanzamiento: new Date("2021-09-24"),
      productor: "JYP Entertainment",
      NoCanciones: 16,
      NoCopiasVendidas: 850000,
      Canciones: {
        connect: cancionesITZY.map(c => ({ id: c.id }))
      }
    }
  })

  const albumAespa = await prisma.album.create({
    data: {
      // idGrupo eliminado, relación ahora es por tablas intermedias
      titulo: "Savage",
      fechaLanzamiento: new Date("2021-10-05"),
      productor: "SM Entertainment",
      NoCanciones: 6,
      NoCopiasVendidas: 1200000,
      Canciones: {
        connect: cancionesAespa.map(c => ({ id: c.id }))
      }
    }
  })

  const albumRedVelvet = await prisma.album.create({
    data: {
      // idGrupo eliminado, relación ahora es por tablas intermedias
      titulo: "The ReVe Festival Finale",
      fechaLanzamiento: new Date("2019-12-23"),
      productor: "SM Entertainment",
      NoCanciones: 16,
      NoCopiasVendidas: 800000,
      Canciones: {
        connect: cancionesRedVelvet.map(c => ({ id: c.id }))
      }
    }
  })

  const albumSeventeen = await prisma.album.create({
    data: {
      // idGrupo eliminado, relación ahora es por tablas intermedias
      titulo: "Your Choice",
      fechaLanzamiento: new Date("2021-06-18"),
      productor: "Pledis Entertainment",
      NoCanciones: 9,
      NoCopiasVendidas: 1900000,
      Canciones: {
        connect: cancionesSeventeen.map(c => ({ id: c.id }))
      }
    }
  })
  console.log('✅ 8 Álbumes creados')
//#endregion










//#region Artista
  console.log('🎤 Creando lanzamientos de artistas...')
  await prisma.artistaLanzaAlbum.createMany({
    data: [
      { idAp: artista1.idAp, idGr: artista1.idGr, idAlb: albumNCT.id },
      { idAp: artista2.idAp, idGr: artista2.idGr, idAlb: albumBlackpink.id },
      { idAp: artista3.idAp, idGr: artista3.idGr, idAlb: albumTwice.id },
      { idAp: artista4.idAp, idGr: artista4.idGr, idAlb: albumBTS.id },
      { idAp: artista5.idAp, idGr: artista5.idGr, idAlb: albumITZY.id },
      { idAp: artista6.idAp, idGr: artista6.idGr, idAlb: albumAespa.id },
      { idAp: artista7.idAp, idGr: artista7.idGr, idAlb: albumRedVelvet.id },
      { idAp: artista8.idAp, idGr: artista8.idGr, idAlb: albumSeventeen.id }
    ]
  })
  console.log('✅ Lanzamientos de artistas creados')

  // Actualizar arrays directos para ArtistaLanzaAlbum
  const artistaLanzaAlbum = [
    { idAp: artista1.idAp, idGr: artista1.idGr, idAlb: albumNCT.id },
    { idAp: artista2.idAp, idGr: artista2.idGr, idAlb: albumBlackpink.id },
    { idAp: artista3.idAp, idGr: artista3.idGr, idAlb: albumTwice.id },
    { idAp: artista4.idAp, idGr: artista4.idGr, idAlb: albumBTS.id },
    { idAp: artista5.idAp, idGr: artista5.idGr, idAlb: albumITZY.id },
    { idAp: artista6.idAp, idGr: artista6.idGr, idAlb: albumAespa.id },
    { idAp: artista7.idAp, idGr: artista7.idGr, idAlb: albumRedVelvet.id },
    { idAp: artista8.idAp, idGr: artista8.idGr, idAlb: albumSeventeen.id }
  ];
  for (const { idAp, idGr, idAlb } of artistaLanzaAlbum) {
    await prisma.artista.update({
      where: { idAp_idGr: { idAp, idGr } },
      data: {
        Lanzamientos: {
          connect: { idAp_idGr_idAlb: { idAp, idGr, idAlb } }
        }
      }
    });
    await prisma.album.update({
      where: { id: idAlb },
      data: {
        LanzamientoArtista: {
          connect: { idAp_idGr_idAlb: { idAp, idGr, idAlb } }
        }
      }
    });
  }
//#endregion









//#region Grupo
console.log('🎸 Creando lanzamientos de grupos...')
  await prisma.grupoLanzaAlbum.createMany({
    data: [
      { idGr: nct127.id, idAlb: albumNCT.id },
      { idGr: blackpink.id, idAlb: albumBlackpink.id },
      { idGr: twice.id, idAlb: albumTwice.id },
      { idGr: bts.id, idAlb: albumBTS.id },
      { idGr: itzy.id, idAlb: albumITZY.id },
      { idGr: aespa.id, idAlb: albumAespa.id },
      { idGr: redVelvet.id, idAlb: albumRedVelvet.id },
      { idGr: seventeen.id, idAlb: albumSeventeen.id }
    ]
  })
  console.log('✅ Lanzamientos de grupos creados')

  // Actualizar arrays directos para GrupoLanzaAlbum
  const grupoLanzaAlbum = [
    { idGr: nct127.id, idAlb: albumNCT.id },
    { idGr: blackpink.id, idAlb: albumBlackpink.id },
    { idGr: twice.id, idAlb: albumTwice.id },
    { idGr: bts.id, idAlb: albumBTS.id },
    { idGr: itzy.id, idAlb: albumITZY.id },
    { idGr: aespa.id, idAlb: albumAespa.id },
    { idGr: redVelvet.id, idAlb: albumRedVelvet.id },
    { idGr: seventeen.id, idAlb: albumSeventeen.id }
  ];
  for (const { idGr, idAlb } of grupoLanzaAlbum) {
    await prisma.grupo.update({
      where: { id: idGr },
      data: {
        Lanzamiento: {
          connect: { idGr_idAlb: { idGr, idAlb } }
        }
      }
    });
    await prisma.album.update({
      where: { id: idAlb },
      data: {
        LanzamientoGrupo: {
          connect: { idGr_idAlb: { idGr, idAlb } }
        }
      }
    });
  }
//#endregion








//#region Premios
  console.log('🏆 Creando premios...')
  const premioMAMA = await prisma.premio.create({
    data: { tituloPremio: "Album of the Year", nombreAcademia: "Mnet Asian Music Awards", requisito: 1000000 }
  })
  const premioGoldenDisc = await prisma.premio.create({
    data: { tituloPremio: "Album Daesang", nombreAcademia: "Golden Disc Awards", requisito: 500000 }
  })
  const premioSeoul = await prisma.premio.create({
    data: { tituloPremio: "Album Bonsang", nombreAcademia: "Seoul Music Awards", requisito: 300000 }
  })
  const premioGaon = await prisma.premio.create({
    data: { tituloPremio: "Album of the Year", nombreAcademia: "Gaon Chart Music Awards", requisito: 200000 }
  })
  console.log('✅ 4 Premios creados')
//#endregion










  //#region  ÁLBUMES PREMIADOS
  console.log('🎖️ Asignando premios a álbumes...')
  await prisma.albumPremiado.createMany({
    data: [
      { idAlb: albumBTS.id, idPremio: premioMAMA.id, año: 2020 },
      { idAlb: albumBTS.id, idPremio: premioGoldenDisc.id, año: 2021 },
      { idAlb: albumBlackpink.id, idPremio: premioSeoul.id, año: 2020 },
      { idAlb: albumSeventeen.id, idPremio: premioGaon.id, año: 2021 },
      { idAlb: albumNCT.id, idPremio: premioSeoul.id, año: 2020 },
      { idAlb: albumAespa.id, idPremio: premioMAMA.id, año: 2021 }
    ]
  })
  console.log('✅ Premios asignados a álbumes')

  // Asociar premios a álbumes y álbumes a premios para que los arrays se vean en Prisma Studio
  // (rellena los arrays directos en Album y Premio)
  const albumPremiados = [
    { idAlb: albumBTS.id, idPremio: premioMAMA.id },
    { idAlb: albumBTS.id, idPremio: premioGoldenDisc.id },
    { idAlb: albumBlackpink.id, idPremio: premioSeoul.id },
    { idAlb: albumSeventeen.id, idPremio: premioGaon.id },
    { idAlb: albumNCT.id, idPremio: premioSeoul.id },
    { idAlb: albumAespa.id, idPremio: premioMAMA.id }
  ];
  for (const { idAlb, idPremio } of albumPremiados) {
    // Actualiza el array de premios en el álbum
    await prisma.album.update({
      where: { id: idAlb },
      data: {
        Premios: {
          connect: { idAlb_idPremio: { idAlb, idPremio } }
        }
      }
    });
    // Actualiza el array de álbumes en el premio
    await prisma.premio.update({
      where: { id: idPremio },
      data: {
        Albums: {
          connect: { idAlb_idPremio: { idAlb, idPremio } }
        }
      }
    });
  }
//#endregion
 








  //#region  CREAR LISTAS DE POPULARIDAD
  console.log('📊 Creando listas de popularidad...')
  const melonChart = await prisma.listaPopularidad.create({
    data: { nombre: "Melon Top 100", tipoLista: "Digital", requisito: 100000 }
  })
  const genieChart = await prisma.listaPopularidad.create({
    data: { nombre: "Genie Chart", tipoLista: "Digital", requisito: 80000 }
  })
  const bugsChart = await prisma.listaPopularidad.create({
    data: { nombre: "Bugs Chart", tipoLista: "Streaming", requisito: 60000 }
  })
  const billboardKpop = await prisma.listaPopularidad.create({
    data: { nombre: "Billboard K-Pop Hot 100", tipoLista: "Internacional", requisito: 200000 }
  })
  console.log('✅ 4 Listas de popularidad creadas')
//#endregion










  //#region  CANCIONES EN LISTAS DE POPULARIDAD
  console.log('📈 Asignando canciones a listas de popularidad...')
  await prisma.cancionEnListaDePopularidad.createMany({
    data: [
      { idCa: cancionesBTS[0].id, idLista: melonChart.id, posicion: 1, año: 2020 },
      { idCa: cancionesBTS[1].id, idLista: melonChart.id, posicion: 1, año: 2021 },
      { idCa: cancionesBlackpink[0].id, idLista: melonChart.id, posicion: 2, año: 2020 },
      { idCa: cancionesBlackpink[1].id, idLista: genieChart.id, posicion: 1, año: 2020 },
      { idCa: cancionesTwice[0].id, idLista: melonChart.id, posicion: 3, año: 2021 },
      { idCa: cancionesAespa[0].id, idLista: bugsChart.id, posicion: 1, año: 2021 },
      { idCa: cancionesITZY[0].id, idLista: genieChart.id, posicion: 5, año: 2020 },
      { idCa: cancionesNCT[0].id, idLista: bugsChart.id, posicion: 3, año: 2020 },
      { idCa: cancionesRedVelvet[0].id, idLista: melonChart.id, posicion: 2, año: 2019 },
      { idCa: cancionesSeventeen[0].id, idLista: genieChart.id, posicion: 4, año: 2017 },
      { idCa: cancionesBTS[0].id, idLista: billboardKpop.id, posicion: 1, año: 2020 },
      { idCa: cancionesBlackpink[1].id, idLista: billboardKpop.id, posicion: 2, año: 2020 }
    ]
  })
  console.log('✅ Canciones asignadas a listas de popularidad')
//#endregion










  //#region  CREAR ACTIVIDADES
  console.log('🎭 Creando actividades...')
  // Fechas recientes y próximas (diciembre 2025 y enero 2026)
  const fechas: string[] = [
    "2025-12-12", "2025-12-12", "2025-12-12", "2025-12-13", "2025-12-13", "2025-12-14",
    "2025-12-15", "2025-12-15", "2025-12-15", "2025-12-16", "2025-12-17", "2025-12-18",
    "2025-12-18", "2025-12-19", "2025-12-20", "2026-01-05", "2026-01-05", "2026-01-06"
  ];
  const actividadesData: { responsable: string, lugar: string, tipoActividad: string, tipoEvento: string }[] = [
    { responsable: "SM Entertainment", lugar: "Olympic Stadium, Seúl", tipoActividad: "Concierto", tipoEvento: "Tour Mundial" },
    { responsable: "YG Entertainment", lugar: "Coex Artium, Seúl", tipoActividad: "Fan Meeting", tipoEvento: "Encuentro con Fans" },
    { responsable: "JYP Entertainment", lugar: "KSPO Dome, Seúl", tipoActividad: "Showcase", tipoEvento: "Presentación Especial" },
    { responsable: "HYBE Corporation", lugar: "Madison Square Garden, NY", tipoActividad: "Concierto", tipoEvento: "Tour Mundial" },
    { responsable: "Starship Entertainment", lugar: "Gocheok Sky Dome, Seúl", tipoActividad: "Festival", tipoEvento: "Festival K-Pop" },
    { responsable: "Cube Entertainment", lugar: "Busan Asiad Stadium", tipoActividad: "Concierto", tipoEvento: "Evento Especial" },
    { responsable: "Pledis Entertainment", lugar: "Jamsil Arena, Seúl", tipoActividad: "Fan Meeting", tipoEvento: "Encuentro con Fans" },
    { responsable: "SM Entertainment", lugar: "SM Studios, Seúl", tipoActividad: "Grabación", tipoEvento: "Sesión de Estudio" },
    { responsable: "YG Entertainment", lugar: "Coachella, California", tipoActividad: "Festival", tipoEvento: "Festival Internacional" },
    { responsable: "JYP Entertainment", lugar: "Incheon Munhak Stadium", tipoActividad: "Concierto", tipoEvento: "Tour Nacional" },
    { responsable: "HYBE Corporation", lugar: "Tokyo Dome, Japón", tipoActividad: "Concierto", tipoEvento: "Tour Asiático" },
    { responsable: "Starship Entertainment", lugar: "Olympic Hall, Seúl", tipoActividad: "Showcase", tipoEvento: "Presentación Especial" },
    { responsable: "Cube Entertainment", lugar: "SMTOWN Theatre, Seúl", tipoActividad: "Fan Meeting", tipoEvento: "Encuentro con Fans" },
    { responsable: "Pledis Entertainment", lugar: "Jamsil Arena, Seúl", tipoActividad: "Concierto", tipoEvento: "Tour Nacional" },
    { responsable: "SM Entertainment", lugar: "SM Studios, Seúl", tipoActividad: "Grabación", tipoEvento: "Sesión de Estudio" },
    { responsable: "YG Entertainment", lugar: "Coex Artium, Seúl", tipoActividad: "Fan Meeting", tipoEvento: "Encuentro con Fans" },
    { responsable: "JYP Entertainment", lugar: "KSPO Dome, Seúl", tipoActividad: "Showcase", tipoEvento: "Presentación Especial" },
    { responsable: "HYBE Corporation", lugar: "Madison Square Garden, NY", tipoActividad: "Concierto", tipoEvento: "Tour Mundial" }
  ];
  const actividades: any[] = [];
  for (let i = 0; i < fechas.length; i++) {
    const fecha = fechas[i] ?? "2025-12-12";
    const data = actividadesData[i % actividadesData.length] || { responsable: "Desconocido", lugar: "Lugar desconocido", tipoActividad: "Otro", tipoEvento: "Otro" };
    actividades.push(await prisma.actividad.create({
      data: {
        responsable: data.responsable || "Desconocido",
        lugar: data.lugar || "Lugar desconocido",
        fecha: new Date(fecha),
        tipoActividad: data.tipoActividad || "Otro",
        tipoEvento: data.tipoEvento || "Otro",
        estado: "PENDIENTE" // Valor por defecto según la migración
      }
    }));
  }
  console.log(`✅ ${actividades.length} Actividades creadas`)
//#endregion










  //#region  INGRESOS DE ACTIVIDADES
  console.log('💰 Creando registros de ingresos...')
  const ingresosData = actividades.map((act, idx) => [
    {
      idAct: act.id,
      monto: 1000000 + (idx * 100000),
      fecha: act.fecha,
      descripcion: `Ingreso principal para actividad ${idx + 1}`
    },
    {
      idAct: act.id,
      monto: 200000 + (idx * 50000),
      fecha: act.fecha,
      descripcion: `Ingreso secundario para actividad ${idx + 1}`
    }
  ]).flat();
  await prisma.ingreso.createMany({ data: ingresosData });
  console.log(`✅ ${ingresosData.length} Registros de ingresos creados`)

  // Actualizar arrays directos en Actividad para los ingresos
  // Buscar los ingresos creados y asociarlos a su actividad
  const allIngresos = await prisma.ingreso.findMany();
  for (const ingreso of allIngresos) {
    await prisma.actividad.update({
      where: { id: ingreso.idAct },
      data: {
        Ingreso: {
          connect: { idIng_idAct: { idIng: ingreso.idIng, idAct: ingreso.idAct } }
        }
      }
    });
  }
//#endregion









  //#region  PERSONAS EN ACTIVIDADES
  console.log('👤 Asignando participantes a actividades...')
  const artistas = [artista1, artista2, artista3, artista4, artista5, artista6, artista7, artista8];
  const grupos = [nct127, blackpink, twice, bts, itzy, aespa, redVelvet, seventeen];
  const personasEnActividadData = actividades.map((act, idx) => {
    const artista = artistas[idx % artistas.length] || artistas[0];
    const grupo = grupos[idx % grupos.length] || grupos[0];
  
    return {
      idAp: artista?.idAp ?? null,
      idGr: artista?.idGr ?? null,
      idAct: act.id,
      idGrupos: grupo?.id ?? null,
      aceptado: null
    };
  }) as Prisma.PersonasEnActividadCreateManyInput[];
  
  await prisma.personasEnActividad.createMany({
    data: personasEnActividadData
  });

  console.log(`✅ ${personasEnActividadData.length} Participantes asignados a actividades`)

  // Asociar campos opcionales en PersonasEnActividad para poblar arrays inversos (idAp, idGr, idGrupos)
  const personasEnActividad = await prisma.personasEnActividad.findMany();
  for (const persona of personasEnActividad) {
    // Asignar idAp y idGr si corresponde (relación con artista)
    if (!persona.idAp && artistas[0] && typeof artistas[0].idAp === 'number') {
      await prisma.personasEnActividad.update({
        where: { id: persona.id },
        data: { idAp: artistas[0].idAp }
      });
    }
    if (!persona.idGr && artistas[0] && typeof artistas[0].idGr === 'number') {
      await prisma.personasEnActividad.update({
        where: { id: persona.id },
        data: { idGr: artistas[0].idGr }
      });
    }
    // Asignar idGrupos si corresponde (relación con grupo)
    if (!persona.idGrupos && grupos[0] && typeof grupos[0].id === 'number') {
      await prisma.personasEnActividad.update({
        where: { id: persona.id },
        data: { idGrupos: grupos[0].id }
      });
    }
  }
//#endregion









  //#region  CREAR SOLICITUDES DE GRUPO
  console.log('📝 Creando solicitudes de formación de grupos...')
  const solicitud1 = await prisma.solicitud.create({
    data: {
      nombreGrupo: "New Generation",
      idConcepto: conceptoFuturista.id,
      idAgencia: smEntertainment.id,
      fechaSolicitud: new Date("2024-01-15"),
      estado: "PENDIENTE"
    }
  })
  const solicitud2 = await prisma.solicitud.create({
    data: {
      nombreGrupo: "Rising Stars",
      idConcepto: conceptoCute.id,
      idAgencia: jypEntertainment.id,
      fechaSolicitud: new Date("2024-02-20"),
      estado: "PENDIENTE"
    }
  })
  const solicitud3 = await prisma.solicitud.create({
    data: {
      nombreGrupo: "Urban Legends",
      idConcepto: conceptoUrbano.id,
      idAgencia: hibeEntertainment.id,
      fechaSolicitud: new Date("2024-03-10"),
      estado: "PENDIENTE"
    }
  })
  console.log('✅ 3 Solicitudes de grupo creadas')
//#endregion











  //#region  APRENDICES SOLICITANDO GRUPOS
  await prisma.aprendizSolicitaGrupo.createMany({
    data: [
      { idAp: aprendiz1.id, idAg: smEntertainment.id, idSolicitud: solicitud1.id, rol: "LIDER", estado: "ACEPTADO" },
      { idAp: aprendiz2.id, idAg: ygEntertainment.id, idSolicitud: solicitud1.id, rol: "VOCALISTA", estado: "PENDIENTE" },
      { idAp: aprendiz7.id, idAg: starshipEntertainment.id, idSolicitud: solicitud1.id, rol: "BATERISTA", estado: "PENDIENTE" },
      { idAp: aprendiz8.id, idAg: hibeEntertainment.id, idSolicitud: solicitud1.id, rol: "RAPERO", estado: "RECHAZADO" },

      { idAp: aprendiz7.id, idAg: starshipEntertainment.id, idSolicitud: solicitud2.id, rol: "VOCALISTA", estado: "PENDIENTE" },
      { idAp: aprendiz1.id, idAg: smEntertainment.id, idSolicitud: solicitud2.id, rol: "BATERISTA", estado: "RECHAZADO" },

      { idAp: aprendiz1.id, idAg: smEntertainment.id, idSolicitud: solicitud3.id, rol: "BATERISTA", estado: "RECHAZADO" },
      { idAp: aprendiz8.id, idAg: hibeEntertainment.id, idSolicitud: solicitud3.id, rol: "BAILARIN", estado: "RECHAZADO" },
      { idAp: aprendiz2.id, idAg: ygEntertainment.id, idSolicitud: solicitud3.id, rol: "VOCALISTA", estado: "PENDIENTE" },

    ]
  })
  console.log('✅ Solicitudes de aprendices creadas')

  // Actualizar arrays directos para AprendizSolicitaGrupo
  const aprendizSolicitaGrupo = [
    { idAp: aprendiz1.id, idAg: smEntertainment.id, idSolicitud: solicitud1.id },
    { idAp: aprendiz2.id, idAg: ygEntertainment.id, idSolicitud: solicitud1.id },
    { idAp: aprendiz7.id, idAg: starshipEntertainment.id, idSolicitud: solicitud1.id },
    { idAp: aprendiz8.id, idAg: hibeEntertainment.id, idSolicitud: solicitud1.id },

    { idAp: aprendiz1.id, idAg: smEntertainment.id, idSolicitud: solicitud2.id },
    { idAp: aprendiz7.id, idAg: starshipEntertainment.id, idSolicitud: solicitud2.id },

    { idAp: aprendiz1.id, idAg: smEntertainment.id, idSolicitud: solicitud3.id },
    { idAp: aprendiz8.id, idAg: hibeEntertainment.id, idSolicitud: solicitud3.id },
    { idAp: aprendiz2.id, idAg: ygEntertainment.id, idSolicitud: solicitud3.id },

  ];
  for (const { idAp, idAg, idSolicitud } of aprendizSolicitaGrupo) {
    await prisma.aprendiz.update({
      where: { id: idAp },
      data: {
        SolicitudGrupo: {
          connect: { idAp_idAg_idSolicitud: { idAp, idAg, idSolicitud } }
        }
      }
    });
    await prisma.agencia.update({
      where: { id: idAg },
      data: {
        SolicitudesAprendiz: {
          connect: { idAp_idAg_idSolicitud: { idAp, idAg, idSolicitud } }
        }
      }
    });
    await prisma.solicitud.update({
      where: { id: idSolicitud },
      data: {
        SolicitudGrupoAprendiz: {
          connect: { idAp_idAg_idSolicitud: { idAp, idAg, idSolicitud } }
        }
      }
    });
  }
//#endregion









  //#region  ARTISTAS SOLICITANDO GRUPOS
  const artista14 = await prisma.artista.findUnique({where:{idAp: 14}});
  const artista15 = await prisma.artista.findUnique({where:{idAp: 15}})
  const artista16 = await prisma.artista.findUnique({where:{idAp: 16}})


  console.log('⭐ Creando solicitudes de artistas para nuevos grupos...')
  await prisma.artistaSolicitaGrupo.createMany({
    data: [
      { idAp: artista16!.idAp, idGr: artista16!.idGr, idAg: ygEntertainment.id, idSolicitud: solicitud1.id, rol: "VOCALISTA", estado: "RECHAZADO" },

      { idAp: artista14!.idAp, idGr: artista14!.idGr, idAg: ygEntertainment.id, idSolicitud: solicitud2.id, rol: "LIDER", estado: "ACEPTADO" },

      { idAp: artista15!.idAp, idGr: artista15!.idGr, idAg: hibeEntertainment.id, idSolicitud: solicitud3.id, rol: "VOCALISTA", estado: "PENDIENTE" },
      { idAp: artista16!.idAp, idGr: artista16!.idGr, idAg: ygEntertainment.id, idSolicitud: solicitud3.id, rol: "LIDER", estado: "ACEPTADO" }

    ]
  })
  console.log('✅ Solicitudes de artistas creadas')

  // Actualizar arrays directos para ArtistaSolicitaGrupo
  const artistaSolicitaGrupo = [
    { idAp: artista16!.idAp, idGr: artista16!.idGr, idAg: ygEntertainment.id, idSolicitud: solicitud1.id },

    { idAp: artista14!.idAp, idGr: artista14!.idGr, idAg: ygEntertainment.id, idSolicitud: solicitud2.id },

    { idAp: artista15!.idAp, idGr: artista15!.idGr, idAg: hibeEntertainment.id, idSolicitud: solicitud3.id },
    { idAp: artista16!.idAp, idGr: artista16!.idGr, idAg: ygEntertainment.id, idSolicitud: solicitud3.id }

  ];
  for (const { idAp, idGr, idAg, idSolicitud } of artistaSolicitaGrupo) {
    await prisma.artista.update({
      where: { idAp_idGr: { idAp, idGr } },
      data: {
        SolicitudGrupo: {
          connect: { idAp_idGr_idAg_idSolicitud: { idAp, idGr, idAg, idSolicitud } }
        }
      }
    });
    await prisma.agencia.update({
      where: { id: idAg },
      data: {
        SolicitudesArtistas: {
          connect: { idAp_idGr_idAg_idSolicitud: { idAp, idGr, idAg, idSolicitud } }
        }
      }
    });
    await prisma.solicitud.update({
      where: { id: idSolicitud },
      data: {
        SolicitudGrupoArtista: {
          connect: { idAp_idGr_idAg_idSolicitud: { idAp, idGr, idAg, idSolicitud } }
        }
      }
    });
  }

  // Asociar aprendices directamente a la solicitud (para llenar AprendizMiembro)
  await prisma.aprendiz.update({ where: { id: aprendiz1.id }, data: { idSolicitud: solicitud1.id } });
  await prisma.aprendiz.update({ where: { id: aprendiz7.id }, data: { idSolicitud: solicitud2.id } });
  await prisma.aprendiz.update({ where: { id: aprendiz8.id }, data: { idSolicitud: solicitud3.id } });

  // Asociar artistas directamente a la solicitud (para llenar ArtistaMiembro)
  await prisma.artista.update({ where: { idAp_idGr: { idAp: artista1.idAp, idGr: artista1.idGr } }, data: { idSolicitud: solicitud1.id } });
  await prisma.artista.update({ where: { idAp_idGr: { idAp: artista5.idAp, idGr: artista5.idGr } }, data: { idSolicitud: solicitud2.id } });

  // Ejemplo de consultas con include para verificar relaciones intermedias
  // (Se ejecutan solo al final, después de poblar todas las tablas)
  console.log('\n🔎 Ejemplo de consultas con include para relaciones intermedias:');
  // Solicitud con aprendices y artistas asociados
  const solicitudesIncl = await prisma.solicitud.findMany({
    include: {
      SolicitudGrupoAprendiz: { include: { aprendiz: true, agencia: true } },
      SolicitudGrupoArtista: { include: { artista: true, agencia: true } }
    }
  });
  console.log('Solicitudes con aprendices y artistas asociados:', JSON.stringify(solicitudesIncl, null, 2));
  //#endregion
}




main()
  .then(() => {
    console.log('\n🎉 ¡Semilla completada exitosamente!')
    console.log('📊 Resumen de datos creados:')
    console.log('   - 1 Usuario administrador')
    console.log('   - 7 Agencias')
    console.log('   - 7 Conceptos y 7 Conceptos visuales')
    console.log('   - 9 Grupos K-Pop (8 activos + 1 disuelto)')
    console.log('   - 43 Aprendices')
    console.log('   - 38 Artistas')
    console.log('   - 19+ Contratos (11 individuales + 8 de grupo)')
    console.log('   - 24 Canciones')
    console.log('   - 8 Álbumes')
    console.log('   - 4 Premios')
    console.log('   - 4 Listas de popularidad')
    console.log('   - 18+ Actividades con ingresos')
    console.log('   - 3 Solicitudes de formación de grupos')
    console.log('   - 3 Artistas solistas con contratos activos (ex-miembros de Echo Legacy)')
    console.log('   - Y mucho más...')
  })
  .catch((e) => {
    console.error('❌ Error al ejecutar la semilla:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
