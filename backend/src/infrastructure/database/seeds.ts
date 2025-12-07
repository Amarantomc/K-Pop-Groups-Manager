// seeds.ts
import { PrismaClient } from '../../generated/prisma'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando población de la base de datos...')

  // 0. CREAR USUARIO ADMINISTRADOR
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

  // 1. CREAR AGENCIAS
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

  // 2. CREAR CONCEPTOS
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

  // 3. CREAR CONCEPTOS VISUALES
  console.log('🖼️ Creando conceptos visuales...')
  const visualFuturista = await prisma.conceptoVisual.create({
    data: { imagen: "futurista-neon-lights.jpg" }
  })
  const visualUrbano = await prisma.conceptoVisual.create({
    data: { imagen: "urbano-street-graffiti.jpg" }
  })
  const visualElegante = await prisma.conceptoVisual.create({
    data: { imagen: "elegante-black-white.jpg" }
  })
  const visualCute = await prisma.conceptoVisual.create({
    data: { imagen: "cute-pastel-colors.jpg" }
  })
  const visualDark = await prisma.conceptoVisual.create({
    data: { imagen: "dark-gothic-aesthetic.jpg" }
  })
  const visualRetro = await prisma.conceptoVisual.create({
    data: { imagen: "retro-vintage-80s.jpg" }
  })
  const visualFantasia = await prisma.conceptoVisual.create({
    data: { imagen: "fantasia-magical-world.jpg" }
  })
  console.log('✅ 7 Conceptos visuales creados')

  // 4. CREAR GRUPOS
  console.log('👥 Creando grupos...')
  const nct127 = await prisma.grupo.create({
    data: {
      nombreCompleto: "NCT 127",
      fechaDebut: new Date("2016-07-07"),
      estadoGrupo: "Activo",
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
      estadoGrupo: "Activo",
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
      estadoGrupo: "Activo",
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
      estadoGrupo: "Activo",
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
      estadoGrupo: "Activo",
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
      estadoGrupo: "Activo",
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
      estadoGrupo: "Activo",
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
      estadoGrupo: "Activo",
      idConcepto: conceptoRetro.id,
      idConceptoVisual: visualRetro.id,
      Nomiembros: 13,
      Agencias: { connect: [{ id: pledisEntertainment.id }] }
    }
  })
  console.log('✅ 8 Grupos creados')

  // 5. CREAR APRENDICES
  console.log('🎓 Creando aprendices...')
  const aprendiz1 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Kim Minju",
      fechaNacimiento: new Date("2001-02-05"),
      edad: 23,
      nivelEntrenamiento: 3,
      estadoAprendiz: "En entrenamiento"
    }
  })
  const aprendiz2 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Park Jisung",
      fechaNacimiento: new Date("2002-02-05"),
      edad: 22,
      nivelEntrenamiento: 2,
      estadoAprendiz: "En entrenamiento"
    }
  })
  const aprendiz3 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Lee Chaeryeong",
      fechaNacimiento: new Date("2001-06-05"),
      edad: 23,
      nivelEntrenamiento: 4,
      estadoAprendiz: "En entrenamiento"
    }
  })
  const aprendiz4 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Choi Yeonjun",
      fechaNacimiento: new Date("1999-09-13"),
      edad: 25,
      nivelEntrenamiento: 5,
      estadoAprendiz: "Debutado"
    }
  })
  const aprendiz5 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Hwang Yeji",
      fechaNacimiento: new Date("2000-05-26"),
      edad: 24,
      nivelEntrenamiento: 5,
      estadoAprendiz: "Debutado"
    }
  })
  const aprendiz6 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Yoo Jimin (Karina)",
      fechaNacimiento: new Date("2000-04-11"),
      edad: 24,
      nivelEntrenamiento: 5,
      estadoAprendiz: "Debutado"
    }
  })
  const aprendiz7 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Jung Somin",
      fechaNacimiento: new Date("2003-08-15"),
      edad: 21,
      nivelEntrenamiento: 2,
      estadoAprendiz: "En entrenamiento"
    }
  })
  const aprendiz8 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Lee Minho",
      fechaNacimiento: new Date("2002-10-25"),
      edad: 22,
      nivelEntrenamiento: 3,
      estadoAprendiz: "En entrenamiento"
    }
  })
  const aprendiz9 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Bae Joohyun (Irene)",
      fechaNacimiento: new Date("1991-03-29"),
      edad: 33,
      nivelEntrenamiento: 5,
      estadoAprendiz: "Debutado"
    }
  })
  const aprendiz10 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Choi Seungcheol (S.Coups)",
      fechaNacimiento: new Date("1995-08-08"),
      edad: 29,
      nivelEntrenamiento: 5,
      estadoAprendiz: "Debutado"
    }
  })
  const aprendiz11 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Kim Taehyung (V)",
      fechaNacimiento: new Date("1995-12-30"),
      edad: 28,
      nivelEntrenamiento: 5,
      estadoAprendiz: "Debutado"
    }
  })
  const aprendiz12 = await prisma.aprendiz.create({
    data: {
      nombreCompleto: "Park Chaeyoung (Rosé)",
      fechaNacimiento: new Date("1997-02-11"),
      edad: 27,
      nivelEntrenamiento: 5,
      estadoAprendiz: "Debutado"
    }
  })
  console.log('✅ 12 Aprendices creados')

  // 6. APRENDICES EN AGENCIA
  console.log('🏢 Asignando aprendices a agencias...')
  await prisma.aprendizEnAgencia.createMany({
    data: [
      { idAp: aprendiz1.id, idAg: smEntertainment.id, fechaInicio: new Date("2019-01-15") },
      { idAp: aprendiz2.id, idAg: ygEntertainment.id, fechaInicio: new Date("2018-06-20") },
      { idAp: aprendiz3.id, idAg: jypEntertainment.id, fechaInicio: new Date("2017-03-10") },
      { idAp: aprendiz4.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2016-05-01"), fechaFinalizacion: new Date("2019-03-04") },
      { idAp: aprendiz5.id, idAg: jypEntertainment.id, fechaInicio: new Date("2017-08-15"), fechaFinalizacion: new Date("2019-02-12") },
      { idAp: aprendiz6.id, idAg: smEntertainment.id, fechaInicio: new Date("2016-09-01"), fechaFinalizacion: new Date("2020-11-17") },
      { idAp: aprendiz7.id, idAg: starshipEntertainment.id, fechaInicio: new Date("2021-07-10") },
      { idAp: aprendiz8.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2020-11-05") },
      { idAp: aprendiz9.id, idAg: smEntertainment.id, fechaInicio: new Date("2009-03-20"), fechaFinalizacion: new Date("2014-08-01") },
      { idAp: aprendiz10.id, idAg: pledisEntertainment.id, fechaInicio: new Date("2010-05-15"), fechaFinalizacion: new Date("2015-05-26") },
      { idAp: aprendiz11.id, idAg: hibeEntertainment.id, fechaInicio: new Date("2011-06-13"), fechaFinalizacion: new Date("2013-06-13") },
      { idAp: aprendiz12.id, idAg: ygEntertainment.id, fechaInicio: new Date("2012-08-08"), fechaFinalizacion: new Date("2016-08-08") }
    ]
  })
  console.log('✅ Aprendices asignados a agencias')

  // 7. EVALUACIONES DE APRENDICES
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

  // 8. CREAR ARTISTAS
  console.log('🌟 Creando artistas...')
  const artista1 = await prisma.artista.create({
    data: {
      idAp: aprendiz4.id,
      idGr: nct127.id,
      nombreArtistico: "Taeyong",
      fechaDebut: new Date("2016-07-07"),
      estadoArtista: "Activo"
    }
  })
  const artista2 = await prisma.artista.create({
    data: {
      idAp: aprendiz12.id,
      idGr: blackpink.id,
      nombreArtistico: "Rosé",
      fechaDebut: new Date("2016-08-08"),
      estadoArtista: "Activo"
    }
  })
  const artista3 = await prisma.artista.create({
    data: {
      idAp: aprendiz3.id,
      idGr: twice.id,
      nombreArtistico: "Chaeyoung",
      fechaDebut: new Date("2015-10-20"),
      estadoArtista: "Activo"
    }
  })
  const artista4 = await prisma.artista.create({
    data: {
      idAp: aprendiz11.id,
      idGr: bts.id,
      nombreArtistico: "V",
      fechaDebut: new Date("2013-06-13"),
      estadoArtista: "Activo"
    }
  })
  const artista5 = await prisma.artista.create({
    data: {
      idAp: aprendiz5.id,
      idGr: itzy.id,
      nombreArtistico: "Yeji",
      fechaDebut: new Date("2019-02-12"),
      estadoArtista: "Activo"
    }
  })
  const artista6 = await prisma.artista.create({
    data: {
      idAp: aprendiz6.id,
      idGr: aespa.id,
      nombreArtistico: "Karina",
      fechaDebut: new Date("2020-11-17"),
      estadoArtista: "Activo"
    }
  })
  const artista7 = await prisma.artista.create({
    data: {
      idAp: aprendiz9.id,
      idGr: redVelvet.id,
      nombreArtistico: "Irene",
      fechaDebut: new Date("2014-08-01"),
      estadoArtista: "Activo"
    }
  })
  const artista8 = await prisma.artista.create({
    data: {
      idAp: aprendiz10.id,
      idGr: seventeen.id,
      nombreArtistico: "S.Coups",
      fechaDebut: new Date("2015-05-26"),
      estadoArtista: "Activo"
    }
  })
  console.log('✅ 8 Artistas creados')

  // 9. CONTRATOS INDIVIDUALES
  console.log('📝 Creando contratos individuales...')
  await prisma.contrato.createMany({
    data: [
      {
        idAg: smEntertainment.id,
        idAp: artista1.idAp,
        idGr: artista1.idGr,
        fechaInicio: new Date("2016-07-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato estándar por 7 años con cláusulas de renovación",
        distribucionIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: ygEntertainment.id,
        idAp: artista2.idAp,
        idGr: artista2.idGr,
        fechaInicio: new Date("2016-08-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato exclusivo por 5 años con opción de extensión",
        distribucionIngresos: "60% agencia, 40% artista"
      },
      {
        idAg: jypEntertainment.id,
        idAp: artista3.idAp,
        idGr: artista3.idGr,
        fechaInicio: new Date("2015-10-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato por 7 años con opción de renovación",
        distribucionIngresos: "65% agencia, 35% artista"
      },
      {
        idAg: hibeEntertainment.id,
        idAp: artista4.idAp,
        idGr: artista4.idGr,
        fechaInicio: new Date("2013-06-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato por 7 años con distribución equitativa",
        distribucionIngresos: "50% agencia, 50% artista"
      },
      {
        idAg: jypEntertainment.id,
        idAp: artista5.idAp,
        idGr: artista5.idGr,
        fechaInicio: new Date("2019-02-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato por 7 años estándar",
        distribucionIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: smEntertainment.id,
        idAp: artista6.idAp,
        idGr: artista6.idGr,
        fechaInicio: new Date("2020-11-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato por 7 años con cláusulas especiales",
        distribucionIngresos: "70% agencia, 30% artista"
      },
      {
        idAg: smEntertainment.id,
        idAp: artista7.idAp,
        idGr: artista7.idGr,
        fechaInicio: new Date("2014-08-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato por 7 años renovado en 2021",
        distribucionIngresos: "60% agencia, 40% artista"
      },
      {
        idAg: pledisEntertainment.id,
        idAp: artista8.idAp,
        idGr: artista8.idGr,
        fechaInicio: new Date("2015-05-26"),
        estado: "Activo",
        condicionesIniciales: "Contrato por 7 años con términos flexibles",
        distribucionIngresos: "55% agencia, 45% artista"
      }
    ]
  })
  console.log('✅ Contratos individuales creados')

  // 10. CONTRATOS DE GRUPO
  console.log('📋 Creando contratos de grupo...')
  await prisma.contratoGrupo.createMany({
    data: [
      {
        idAg: smEntertainment.id,
        IdGr: nct127.id,
        fechaInicio: new Date("2016-07-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato de grupo por 7 años con actividades conjuntas",
        distribucionIngresos: "50% agencia, 50% grupo"
      },
      {
        idAg: ygEntertainment.id,
        IdGr: blackpink.id,
        fechaInicio: new Date("2016-08-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato de grupo por 5 años renovado en 2021",
        distribucionIngresos: "45% agencia, 55% grupo"
      },
      {
        idAg: jypEntertainment.id,
        IdGr: twice.id,
        fechaInicio: new Date("2015-10-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato de grupo por 7 años con extensión",
        distribucionIngresos: "50% agencia, 50% grupo"
      },
      {
        idAg: hibeEntertainment.id,
        IdGr: bts.id,
        fechaInicio: new Date("2013-06-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato de grupo por 7 años con términos favorables",
        distribucionIngresos: "40% agencia, 60% grupo"
      },
      {
        idAg: jypEntertainment.id,
        IdGr: itzy.id,
        fechaInicio: new Date("2019-02-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato de grupo por 7 años inicial",
        distribucionIngresos: "50% agencia, 50% grupo"
      },
      {
        idAg: smEntertainment.id,
        IdGr: aespa.id,
        fechaInicio: new Date("2020-11-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato de grupo por 7 años con tecnología AI",
        distribucionIngresos: "50% agencia, 50% grupo"
      },
      {
        idAg: smEntertainment.id,
        IdGr: redVelvet.id,
        fechaInicio: new Date("2014-08-01"),
        estado: "Activo",
        condicionesIniciales: "Contrato de grupo por 7 años renovado",
        distribucionIngresos: "48% agencia, 52% grupo"
      },
      {
        idAg: pledisEntertainment.id,
        IdGr: seventeen.id,
        fechaInicio: new Date("2015-05-26"),
        estado: "Activo",
        condicionesIniciales: "Contrato de grupo por 7 años con 13 miembros",
        distribucionIngresos: "45% agencia, 55% grupo"
      }
    ]
  })
  console.log('✅ Contratos de grupo creados')

  // 11. HISTORIAL DE ARTISTAS EN GRUPOS
  console.log('📚 Creando historial de artistas en grupos...')
  await prisma.artistaEnGrupo.createMany({
    data: [
      { idAp: artista1.idAp, idGrupoDebut: nct127.id, idGr: nct127.id, fechaInicio: new Date("2016-07-07"), rol: "Líder, Rapero principal, Bailarín principal" },
      { idAp: artista2.idAp, idGrupoDebut: blackpink.id, idGr: blackpink.id, fechaInicio: new Date("2016-08-08"), rol: "Vocalista principal, Bailarina" },
      { idAp: artista3.idAp, idGrupoDebut: twice.id, idGr: twice.id, fechaInicio: new Date("2015-10-20"), rol: "Rapera principal, Visual" },
      { idAp: artista4.idAp, idGrupoDebut: bts.id, idGr: bts.id, fechaInicio: new Date("2013-06-13"), rol: "Vocalista, Visual, Bailarín" },
      { idAp: artista5.idAp, idGrupoDebut: itzy.id, idGr: itzy.id, fechaInicio: new Date("2019-02-12"), rol: "Líder, Bailarina principal, Rapera" },
      { idAp: artista6.idAp, idGrupoDebut: aespa.id, idGr: aespa.id, fechaInicio: new Date("2020-11-17"), rol: "Líder, Bailarina principal, Rapera" },
      { idAp: artista7.idAp, idGrupoDebut: redVelvet.id, idGr: redVelvet.id, fechaInicio: new Date("2014-08-01"), rol: "Líder, Rapera principal, Visual" },
      { idAp: artista8.idAp, idGrupoDebut: seventeen.id, idGr: seventeen.id, fechaInicio: new Date("2015-05-26"), rol: "Líder general, Rapero, Líder de Hip-hop Team" }
    ]
  })
  console.log('✅ Historial de artistas creado')

  // 12. CREAR CANCIONES
  console.log('🎵 Creando canciones...')
  const cancionesNCT = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Kick It", genero: "K-Pop/Hip-Hop", productor: "Dem Jointz", fechaLanzamiento: new Date("2020-03-06") } }),
    prisma.cancion.create({ data: { titulo: "Cherry Bomb", genero: "K-Pop/EDM", productor: "Kenzie", fechaLanzamiento: new Date("2017-06-14") } }),
    prisma.cancion.create({ data: { titulo: "Sticker", genero: "K-Pop/Experimental", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2021-09-17") } })
  ])

  const cancionesBlackpink = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Lovesick Girls", genero: "K-Pop/Pop", productor: "Teddy Park", fechaLanzamiento: new Date("2020-10-02") } }),
    prisma.cancion.create({ data: { titulo: "How You Like That", genero: "K-Pop/EDM", productor: "Teddy Park", fechaLanzamiento: new Date("2020-06-26") } }),
    prisma.cancion.create({ data: { titulo: "DDU-DU DDU-DU", genero: "K-Pop/Hip-Hop", productor: "Teddy Park", fechaLanzamiento: new Date("2018-06-15") } })
  ])

  const cancionesTwice = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Scientist", genero: "K-Pop/Disco", productor: "J.Y. Park", fechaLanzamiento: new Date("2021-11-12") } }),
    prisma.cancion.create({ data: { titulo: "Feel Special", genero: "K-Pop/R&B", productor: "Park Jin-young", fechaLanzamiento: new Date("2019-09-23") } }),
    prisma.cancion.create({ data: { titulo: "TT", genero: "K-Pop/Pop", productor: "Black Eyed Pilseung", fechaLanzamiento: new Date("2016-10-24") } })
  ])

  const cancionesBTS = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Dynamite", genero: "Disco-Pop", productor: "David Stewart", fechaLanzamiento: new Date("2020-08-21") } }),
    prisma.cancion.create({ data: { titulo: "Butter", genero: "Dance-Pop", productor: "Rob Grimaldi", fechaLanzamiento: new Date("2021-05-21") } }),
    prisma.cancion.create({ data: { titulo: "Spring Day", genero: "K-Pop/Ballad", productor: "Pdogg", fechaLanzamiento: new Date("2017-02-13") } })
  ])

  const cancionesITZY = await Promise.all([
    prisma.cancion.create({ data: { titulo: "WANNABE", genero: "K-Pop/Dance", productor: "Galactika", fechaLanzamiento: new Date("2020-03-09") } }),
    prisma.cancion.create({ data: { titulo: "DALLA DALLA", genero: "K-Pop/Pop", productor: "Galactika", fechaLanzamiento: new Date("2019-02-12") } }),
    prisma.cancion.create({ data: { titulo: "LOCO", genero: "K-Pop/Hip-Hop", productor: "earattack", fechaLanzamiento: new Date("2021-09-24") } })
  ])

  const cancionesAespa = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Next Level", genero: "K-Pop/EDM", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2021-05-17") } }),
    prisma.cancion.create({ data: { titulo: "Savage", genero: "K-Pop/Experimental", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2021-10-05") } }),
    prisma.cancion.create({ data: { titulo: "Black Mamba", genero: "K-Pop/Trap", productor: "Yoo Young-jin", fechaLanzamiento: new Date("2020-11-17") } })
  ])

  const cancionesRedVelvet = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Psycho", genero: "K-Pop/R&B", productor: "Andrew Scott", fechaLanzamiento: new Date("2019-12-23") } }),
    prisma.cancion.create({ data: { titulo: "Red Flavor", genero: "K-Pop/Dance", productor: "Kenzie", fechaLanzamiento: new Date("2017-07-09") } }),
    prisma.cancion.create({ data: { titulo: "Bad Boy", genero: "K-Pop/R&B", productor: "The Stereotypes", fechaLanzamiento: new Date("2018-01-29") } })
  ])

  const cancionesSeventeen = await Promise.all([
    prisma.cancion.create({ data: { titulo: "Don't Wanna Cry", genero: "K-Pop/Dance", productor: "Woozi", fechaLanzamiento: new Date("2017-05-22") } }),
    prisma.cancion.create({ data: { titulo: "Very Nice", genero: "K-Pop/Funk", productor: "Bumzu", fechaLanzamiento: new Date("2016-07-04") } }),
    prisma.cancion.create({ data: { titulo: "Left & Right", genero: "K-Pop/Hip-Hop", productor: "Bumzu", fechaLanzamiento: new Date("2020-06-16") } })
  ])
  console.log('✅ 24 Canciones creadas')

  // 13. CREAR ÁLBUMES
  console.log('💿 Creando álbumes...')
  const albumNCT = await prisma.album.create({
    data: {
      idGrupo: nct127.id,
      titulo: "Neo Zone",
      fechaLanzamiento: new Date("2020-03-06"),
      productor: "SM Entertainment",
      NoCanciones: 13,
      NoCopiasVendidas: 1500000,
      Canciones: {
        connect: cancionesNCT.map(c => ({ id: c.id }))
      }
    }
  })

  const albumBlackpink = await prisma.album.create({
    data: {
      idGrupo: blackpink.id,
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
      idGrupo: twice.id,
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
      idGrupo: bts.id,
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
      idGrupo: itzy.id,
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
      idGrupo: aespa.id,
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
      idGrupo: redVelvet.id,
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
      idGrupo: seventeen.id,
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

  // 14. LANZAMIENTOS DE ÁLBUMES POR ARTISTAS
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

  // 15. LANZAMIENTOS DE ÁLBUMES POR GRUPOS
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

  // 16. CREAR PREMIOS
  console.log('🏆 Creando premios...')
  const premioMAMA = await prisma.premio.create({
    data: { tituloPremio: "Album of the Year", nombreAcademia: "Mnet Asian Music Awards" }
  })
  const premioGoldenDisc = await prisma.premio.create({
    data: { tituloPremio: "Album Daesang", nombreAcademia: "Golden Disc Awards" }
  })
  const premioSeoul = await prisma.premio.create({
    data: { tituloPremio: "Album Bonsang", nombreAcademia: "Seoul Music Awards" }
  })
  const premioGaon = await prisma.premio.create({
    data: { tituloPremio: "Album of the Year", nombreAcademia: "Gaon Chart Music Awards" }
  })
  console.log('✅ 4 Premios creados')

  // 17. ÁLBUMES PREMIADOS
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

  // 18. CREAR LISTAS DE POPULARIDAD
  console.log('📊 Creando listas de popularidad...')
  const melonChart = await prisma.listaPopularidad.create({
    data: { nombre: "Melon Top 100", tipoLista: "Digital" }
  })
  const genieChart = await prisma.listaPopularidad.create({
    data: { nombre: "Genie Chart", tipoLista: "Digital" }
  })
  const bugsChart = await prisma.listaPopularidad.create({
    data: { nombre: "Bugs Chart", tipoLista: "Streaming" }
  })
  const billboardKpop = await prisma.listaPopularidad.create({
    data: { nombre: "Billboard K-Pop Hot 100", tipoLista: "Internacional" }
  })
  console.log('✅ 4 Listas de popularidad creadas')

  // 19. CANCIONES EN LISTAS DE POPULARIDAD
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

  // 20. CREAR ACTIVIDADES
  console.log('🎭 Creando actividades...')
  const concierto1 = await prisma.actividad.create({
    data: {
      responsable: "SM Entertainment",
      lugar: "Olympic Stadium, Seúl",
      fecha: new Date("2023-03-15"),
      tipoActividad: "Concierto",
      tipoEvento: "Tour Mundial"
    }
  })
  const concierto2 = await prisma.actividad.create({
    data: {
      responsable: "YG Entertainment",
      lugar: "Coachella, California",
      fecha: new Date("2023-04-20"),
      tipoActividad: "Festival",
      tipoEvento: "Festival Internacional"
    }
  })
  const fanmeeting1 = await prisma.actividad.create({
    data: {
      responsable: "JYP Entertainment",
      lugar: "KSPO Dome, Seúl",
      fecha: new Date("2023-05-10"),
      tipoActividad: "Fan Meeting",
      tipoEvento: "Encuentro con Fans"
    }
  })
  const showcase1 = await prisma.actividad.create({
    data: {
      responsable: "HYBE Corporation",
      lugar: "Madison Square Garden, Nueva York",
      fecha: new Date("2023-06-25"),
      tipoActividad: "Concierto",
      tipoEvento: "Tour Mundial"
    }
  })
  const grabacion1 = await prisma.actividad.create({
    data: {
      responsable: "SM Entertainment",
      lugar: "SM Studios, Seúl",
      fecha: new Date("2023-07-05"),
      tipoActividad: "Grabación",
      tipoEvento: "Sesión de Estudio"
    }
  })
  console.log('✅ 5 Actividades creadas')

  // 21. INGRESOS DE ACTIVIDADES
  console.log('💰 Creando registros de ingresos...')
  await prisma.ingreso.createMany({
    data: [
      {
        idAct: concierto1.id,
        monto: 2500000.00,
        fecha: new Date("2023-03-15"),
        descripcion: "Venta de entradas para concierto en Olympic Stadium"
      },
      {
        idAct: concierto1.id,
        monto: 500000.00,
        fecha: new Date("2023-03-15"),
        descripcion: "Merchandising del concierto"
      },
      {
        idAct: concierto2.id,
        monto: 3000000.00,
        fecha: new Date("2023-04-20"),
        descripcion: "Pago por presentación en Coachella"
      },
      {
        idAct: fanmeeting1.id,
        monto: 800000.00,
        fecha: new Date("2023-05-10"),
        descripcion: "Venta de entradas para fan meeting"
      },
      {
        idAct: showcase1.id,
        monto: 4500000.00,
        fecha: new Date("2023-06-25"),
        descripcion: "Concierto en Madison Square Garden"
      },
      {
        idAct: showcase1.id,
        monto: 1200000.00,
        fecha: new Date("2023-06-25"),
        descripcion: "Ventas de merchandising exclusivo"
      },
      {
        idAct: grabacion1.id,
        monto: 350000.00,
        fecha: new Date("2023-07-05"),
        descripcion: "Producción de nuevo álbum"
      }
    ]
  })
  console.log('✅ 7 Registros de ingresos creados')

  // 22. PERSONAS EN ACTIVIDADES
  console.log('👤 Asignando participantes a actividades...')
  await prisma.personasEnActividad.createMany({
    data: [
      { idAp: artista1.idAp, idGr: artista1.idGr, idAct: concierto1.id, idGrupos: nct127.id, aceptado: true },
      { idAp: artista6.idAp, idGr: artista6.idGr, idAct: concierto1.id, idGrupos: aespa.id, aceptado: true },
      { idAp: artista2.idAp, idGr: artista2.idGr, idAct: concierto2.id, idGrupos: blackpink.id, aceptado: true },
      { idAp: artista3.idAp, idGr: artista3.idGr, idAct: fanmeeting1.id, idGrupos: twice.id, aceptado: true },
      { idAp: artista5.idAp, idGr: artista5.idGr, idAct: fanmeeting1.id, idGrupos: itzy.id, aceptado: true },
      { idAp: artista4.idAp, idGr: artista4.idGr, idAct: showcase1.id, idGrupos: bts.id, aceptado: true },
      { idAp: artista7.idAp, idGr: artista7.idGr, idAct: grabacion1.id, idGrupos: redVelvet.id, aceptado: true }
    ]
  })
  console.log('✅ Participantes asignados a actividades')

  // 23. CREAR SOLICITUDES DE GRUPO
  console.log('📝 Creando solicitudes de formación de grupos...')
  const solicitud1 = await prisma.solicitud.create({
    data: {
      nombreGrupo: "New Generation",
      idConcepto: conceptoFuturista.id,
      roles: ["Líder", "Vocalista principal", "Rapero", "Bailarín principal", "Visual"],
      idAgencia: smEntertainment.id,
      fechaSolicitud: new Date("2024-01-15")
    }
  })
  const solicitud2 = await prisma.solicitud.create({
    data: {
      nombreGrupo: "Rising Stars",
      idConcepto: conceptoCute.id,
      roles: ["Líder", "Vocalista", "Rapera", "Bailarina", "Maknae"],
      idAgencia: jypEntertainment.id,
      fechaSolicitud: new Date("2024-02-20")
    }
  })
  const solicitud3 = await prisma.solicitud.create({
    data: {
      nombreGrupo: "Urban Legends",
      idConcepto: conceptoUrbano.id,
      roles: ["Líder", "Rapero principal", "Vocalista", "Productor", "Bailarín"],
      idAgencia: hibeEntertainment.id,
      fechaSolicitud: new Date("2024-03-10")
    }
  })
  console.log('✅ 3 Solicitudes de grupo creadas')

  // 24. APRENDICES SOLICITANDO GRUPOS
  console.log('🎯 Creando solicitudes de aprendices para grupos...')
  await prisma.aprendizSolicitaGrupo.createMany({
    data: [
      { idAp: aprendiz1.id, idAg: smEntertainment.id, idSolicitud: solicitud1.id, estado: "Pendiente" },
      { idAp: aprendiz7.id, idAg: starshipEntertainment.id, idSolicitud: solicitud2.id, estado: "Aprobado" },
      { idAp: aprendiz8.id, idAg: hibeEntertainment.id, idSolicitud: solicitud3.id, estado: "En revisión" }
    ]
  })
  console.log('✅ Solicitudes de aprendices creadas')

  // 25. ARTISTAS SOLICITANDO GRUPOS
  console.log('⭐ Creando solicitudes de artistas para nuevos grupos...')
  await prisma.artistaSolicitaGrupo.createMany({
    data: [
      { idAp: artista1.idAp, idGr: artista1.idGr, idAg: smEntertainment.id, idSolicitud: solicitud1.id, estado: "Aprobado" },
      { idAp: artista5.idAp, idGr: artista5.idGr, idAg: jypEntertainment.id, idSolicitud: solicitud2.id, estado: "Pendiente" }
    ]
  })
  console.log('✅ Solicitudes de artistas creadas')

  console.log('\n🎉 ¡Semilla completada exitosamente!')
  console.log('📊 Resumen de datos creados:')
  console.log('   - 1 Usuario administrador')
  console.log('   - 7 Agencias')
  console.log('   - 7 Conceptos y 7 Conceptos visuales')
  console.log('   - 8 Grupos K-Pop')
  console.log('   - 12 Aprendices')
  console.log('   - 8 Artistas')
  console.log('   - 16 Contratos (8 individuales + 8 de grupo)')
  console.log('   - 24 Canciones')
  console.log('   - 8 Álbumes')
  console.log('   - 4 Premios')
  console.log('   - 4 Listas de popularidad')
  console.log('   - 5 Actividades con ingresos')
  console.log('   - 3 Solicitudes de formación de grupos')
  console.log('   - Y mucho más...')
}

main()
  .catch((e) => {
    console.error('❌ Error al ejecutar la semilla:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
