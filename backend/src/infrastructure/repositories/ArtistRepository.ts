import { inject, injectable } from "inversify";
import type { IArtistRepository } from "../../application/interfaces/repositories/IArtistRepository";
import { Types } from "../di/Types";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { CreateArtistDto } from "../../application/dtos/artist/CreateArtistDto";
import type { Artist } from "../../domain/entities/Artist";
import { ArtistResponseDto } from "../../application/dtos/artist/ArtistResponseDto";
import type { UpdateArtistDto } from "../../application/dtos/artist/UpdateArtistDto";
import { ArtistOnDebutResponseDto } from "../../application/dtos/artist/ArtistsOnDebutResponseDto";
import { ArtistWithIncomeDto } from "../../application/dtos/artist/ArtistWithIncomeDto";
import type { RequestArtistWithIncomeDto } from "../../application/dtos/artist/RequestArtistWithIncomeDto";
import { ArtistWithSuccesDto } from "../../application/dtos/artist/ArtistWithSuccesDto";
import type { ActivityResponseDto } from "../../application/dtos/activity/ActivityResponseDto";

@injectable()
export class ArtistRepository implements IArtistRepository {

    constructor( @inject(Types.PrismaClient) private prisma: any,
                @inject(Types.IUnitOfWork) private unitOfWork :UnitOfWork
                
){}

  
private get db() {
    return this.unitOfWork.getTransaction();
  }


  async updateInactiveArtists(): Promise<void> {

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
  
    const artists = await this.db.artista.findMany({
      include: {
        Contrato: true   // individuales
      }
    });
  
    for (const artist of artists) {
  
      /* =========================
         CONTRATOS (OR REAL)
      ========================= */
  
      // 🔹 Contratos individuales
      const hasActiveIndividualContract = artist.Contrato.some(
        (c: any) => new Date(c.fechaFinalizacion) > now
      );
  
      // 🔹 Contratos grupales
      const groupContracts = await this.db.contratoGrupo.findMany({
        where: {
          IdGr: artist.idGr
        }
      });
  
      const hasActiveGroupContract = groupContracts.some(
        (c: any) => new Date(c.fechaFinalizacion) > now
      );
  
      // 👉 OR
      if (hasActiveIndividualContract || hasActiveGroupContract) {
        continue; // artista ACTIVO
      }
  
      /* =========================
         ACTIVIDADES (OR REAL)
      ========================= */
  
      let lastActivityDate: Date | null = null;
  
      // 🔹 Individuales
      const individualActivities = await this.db.personasEnActividad.findMany({
        where: {
          idAp: artist.idAp,
          idGr: artist.idGr
        },
        include: {
          actividad: true
        }
      });
  
      for (const a of individualActivities) {
        const d = new Date(a.actividad.fecha);
        if (!lastActivityDate || d > lastActivityDate) {
          lastActivityDate = d;
        }
      }
  
      // 🔹 Grupales
      const groupActivities = await this.db.personasEnActividad.findMany({
        where: {
          idGrupos: artist.idGr
        },
        include: {
          actividad: true
        }
      });
  
      for (const g of groupActivities) {
        const d = new Date(g.actividad.fecha);
        if (!lastActivityDate || d > lastActivityDate) {
          lastActivityDate = d;
        }
      }
  
      /* =========================
         SIN ACTIVIDADES
      ========================= */
  
      if (!lastActivityDate) {
        await this.db.artista.update({
          where: {
            idAp_idGr: {
              idAp: artist.idAp,
              idGr: artist.idGr
            }
          },
          data: { estadoArtista: "INACTIVO" }
        });
        continue;
      }
  
      /* =========================
         MÁS DE 1 AÑO
      ========================= */
  
      if (lastActivityDate <= oneYearAgo) {
        await this.db.artista.update({
          where: {
            idAp_idGr: {
              idAp: artist.idAp,
              idGr: artist.idGr
            }
          },
          data: { estadoArtista: "INACTIVO" }
        });
      }
    }
  }

    async create(data: CreateArtistDto): Promise<Artist> {
     
    const artist = await this.db.artista.create({
      data: {
        nombreArtistico: data.ArtistName,
        fechaDebut: new Date(data.DebutDate),
        estadoArtista: data.Status,
        idAp: data.ApprenticeId,   
        idGr: data.GroupId          
      }
    })
    return ArtistResponseDto.toEntity(artist);
  }

  async findById(id: any): Promise<Artist | null> {
    const artist = await this.db.artista.findUnique({
      where: {
        idAp_idGr: {
          idAp: Number(id.apprenticeId),
          idGr: Number(id.groupId),
        },
      },
      include: {
        Contrato: {
          where: {
            fechaFinalizacion: null,
          },
          include: {
            Agencia: true,
          },
        },
        HistorialGrupos: {
          include: {
            grupo: true,
          },
        },
        aprendiz: true,
      },
    });
    

     
    return ArtistResponseDto.toEntityForManager(artist);
  }

  async delete(id: any): Promise<void> {
    const apprenticeId = id.apprenticeId;
    const groupId = id.groupId;
  
    // 1️⃣ Borrar relaciones del artista
    await this.db.artistaEnGrupo.deleteMany({
      where: { idAp: apprenticeId },
    });
  
    await this.db.artistaLanzaAlbum.deleteMany({
      where: { idAp: apprenticeId, idGr: groupId },
    });
  
    await this.db.personasEnActividad.deleteMany({
      where: { idAp: apprenticeId, idGr: groupId },
    });
  
    await this.db.artistaSolicitaGrupo.deleteMany({
      where: { idAp: apprenticeId, idGr: groupId },
    });
  
    await this.db.contrato.deleteMany({
      where: { idAp: apprenticeId, idGr: groupId },
    });
  
    await this.db.perfilArtista.deleteMany({
      where: { IdAp: apprenticeId, IdGr: groupId },
    });
  
    // 2️⃣ Borrar el artista
    await this.db.artista.delete({
      where: {
        idAp_idGr: { idAp: apprenticeId, idGr: groupId },
      },
    });
  
    // 3️⃣ Borrar el perfil del aprendiz (si existe)
    await this.db.perfilAprendiz.deleteMany({
      where: { aprendizId: apprenticeId },
    });
  
    // 4️⃣ Borrar evaluaciones del aprendiz
    await this.db.evaluacionAprendiz.deleteMany({
      where: { idAp: apprenticeId },
    });
  
    // 5️⃣ Borrar asignaciones en agencias
    await this.db.aprendizEnAgencia.deleteMany({
      where: { idAp: apprenticeId },
    });
  
    // 6️⃣ Borrar solicitudes de grupo del aprendiz
    await this.db.aprendizSolicitaGrupo.deleteMany({
      where: { idAp: apprenticeId },
    });
  
    // 7️⃣ Finalmente, borrar el aprendiz
    await this.db.aprendiz.delete({
      where: { id: apprenticeId },
    });
  
    // ⚠️ Opcional: si el usuario del aprendiz también debe borrarse
    await this.db.user.deleteMany({
      where: { id: id.userId }, // si tienes userId
    });
  }

  async update(id: any, data: any): Promise<Artist> {
    // Validamos que id tenga apprenticeId y groupId
    if (!id?.apprenticeId || !id?.groupId) {
      throw new Error("Se requiere apprenticeId y groupId válidos en el ID");
    }
  
    // Construimos solo los campos que vienen definidos
    const updateData: any = {};
  
    if (data?.ArtistName !== undefined) {
      updateData.nombreArtistico = String(data.ArtistName);
    }
  
    if (data?.DebutDate !== undefined) {
      const debutDate = new Date(data.DebutDate);
      if (isNaN(debutDate.getTime())) {
        throw new Error("DebutDate no es una fecha válida");
      }
      updateData.fechaDebut = debutDate;
    }
  
    if (data?.Status !== undefined) {
      updateData.estadoArtista = String(data.Status);
    }
  
    // Verificamos si el artista existe antes de actualizar
    const existing = await this.db.artista.findUnique({
      where: {
        idAp_idGr: {
          idAp: id.apprenticeId,
          idGr: id.groupId
        }
      }
    });
  
    if (!existing) {
      throw new Error(`No existe el artista con apprenticeId=${id.apprenticeId} y groupId=${id.groupId}`);
    }
  
    // Actualizamos
    const artist = await this.db.artista.update({
      where: {
        idAp_idGr: {
          idAp: id.apprenticeId,
          idGr: id.groupId
        }
      },
      data: updateData
    });
  
    return ArtistResponseDto.toEntity(artist);
  }
    
  async getAll(): Promise<Artist[]> {

    await this.updateInactiveArtists();

    const artists = await this.db.artista.findMany({
      include: {
        aprendiz: true // 👈 TRAE EL APRENDIZ
      }
    });

    return artists.map((artist: { aprendiz: { nombreCompleto: any; }; }) =>
      ArtistResponseDto.toEntity({
        ...artist,
        realName: artist.aprendiz.nombreCompleto
      })
    );
  }

    async findByName(name: string): Promise<Artist[]> {
        const artists = await this.db.artista.findMany({
            where: {
                nombreArtistico: {
                    contains: name,
                    mode: 'insensitive'
                }
            }
        });
        return artists;
    }

    async findByStatus(status: string): Promise<Artist[]> {
        const artists = await this.db.artista.findMany({
            where: {
                estadoArtista: status
            }
        });
        return artists;
    }

    async addGroupHistory(apprenticeId: number, groupId: number, debutGroupId: number, role: string, startDate: Date): Promise<void> {
          await this.db.artistaEnGrupo.create({
      data: {
        idAp: apprenticeId,
        idGrupoDebut: groupId,
        idGr: debutGroupId,
        rol: role,
        fechaInicio: startDate,
      },
    }); 
  }
  async endGroupMembership(apprenticeId: number, groupId: number, debutGroupId: number, startDate: Date, endDate: Date): Promise<void> {
        await this.db.artistaEnGrupo.update({
      where: {
        idAp_idGrupoDebut_idGr_fechaInicio: {
          idAp: apprenticeId,
          idGrupoDebut: groupId,
          idGr: debutGroupId,
          fechaInicio: startDate,
        },
      },
      data: {
        fechaFinalizacion: endDate,
      },
    });
  }
  
 
  async getActivities(apprenticeId: number, groupId: number): Promise<ActivityResponseDto[]> {
        const activities = await this.db.personasEnActividad.findMany({
      where: {
        idAp: apprenticeId,
        idGr: groupId,
      },include:{
        actividad:true
      }
    });

    return activities.map((a: any) => ({
      activityId: a.idAct,
      accepted: a.aceptado,
      responsible:a.actividad.responsable,
      activityType:a.actividad.tipoActividad,
      date:a.actividad.fecha,
      place:a.actividad.lugar,
      eventType:a.actividad.tipoEvento
    }));
  }
  async addContract(apprenticeId: number, groupId: number, agencyId: number, startDate: Date, endDate?: Date, status?: string, initialConditions?: string, incomeDistribution?: string): Promise<void> {
        await this.db.contrato.create({
      data: {
        idAp: apprenticeId,
        idGr: groupId,
        idAg: agencyId,
        fechaInicio: startDate,
        fechaFinalizacion: endDate,
        estado: status || "ACTIVE",
        condicionesIniciales: initialConditions,
        distribuciónIngresos: incomeDistribution,
      },
    });
  }
  async getContracts(apprenticeId: number, groupId: number): Promise<Array<{ agencyId: number; startDate: Date; endDate?: Date; status: string; }>> {
        const contracts = await this.db.contrato.findMany({
      where: {
        idAp: apprenticeId,
        idGr: groupId,
      },
    });

    return contracts.map((c: any) => ({
      agencyId: c.idAg,
      startDate: c.fechaInicio,
      endDate: c.fechaFinalizacion,
      status: c.estado,
    }));
  }
 async addRelease(apprenticeId: number, groupId: number, albumId: number, visualConceptId: number): Promise<void> {
        await this.db.artistaLanzaAlbum.create({
      data: {
        idAp: apprenticeId,
        idGr: groupId,
        idAlb: albumId,
        idConceptoVisual: visualConceptId,
      },
    });
  }
  async getReleases(apprenticeId: number, groupId: number): Promise<Array<{ albumId: number; visualConceptId: number; }>> {
        const releases = await this.db.artistaLanzaAlbum.findMany({
      where: {
        idAp: apprenticeId,
        idGr: groupId,
      },
    });

    return releases.map((r: any) => ({
      albumId: r.idAlb,
      visualConceptId: r.idConceptoVisual,
    }));
  }

   async findByAgency(id: number): Promise<Artist[]> {
      
    const artists=await this.db.artista.findMany({
         where: {
                Contrato: {
                    some:{
                        idAg:id,
                        fechaFinalizacion:null,
                        }
                    }
                
            },
            include:{
              HistorialGrupos:{
                include:{
                  grupo:true
                }
              },
              aprendiz:{
                 include:{
                  Agencia:{
                    include:{
                      agencia:true
                    }
                  }
                 }
                  
              }
            }

      })
         
       
       
      return ArtistResponseDto.toEntitiesForManager(artists)
  }

   async getSoloArtists(): Promise<Artist[] | null> {
    
    const artists= await this.db.artista.findMany({
       where:{
         HistorialGrupos:{
            every:{
              fechaFinalizacion:{not: null}
            }
         }
       }, include:{
        HistorialGrupos:{
          include:{
            grupo:true
          }
        }, 
         aprendiz:{
                 include:{
                  Agencia:{
                    include:{
                      agencia:true
                    }
                  }
                 }
                  
              }
          
       }
    }) 
      return artists ? ArtistResponseDto.toEntitiesForManager(artists):null
  }

  async getArtistsOnDebut(idAgency:number):Promise<ArtistOnDebutResponseDto[]|null>{
      const artists =await this.db.$queryRaw`
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
      AND c."idAg" = ${idAgency}
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
      return artists ? ArtistOnDebutResponseDto.fromQueryResults(artists):null;
  }

  async getIndividualIncome(data:RequestArtistWithIncomeDto): Promise<ArtistWithIncomeDto|null> {
       const artist = await this.db.$queryRaw`
         SELECT 
        a."idAp" as "apprenticeId",
        a."idGr" as "groupId",
         
        SUM(i."monto") as "TotalIncome"
      FROM "Artista" a
       JOIN "PersonasEnActividad" pea ON a."idAp" = pea."idAp" 
        AND a."idGr" = pea."idGr"
       JOIN "Actividad" act ON pea."idAct" = act."id"
       JOIN "Ingreso" i ON act."id" = i."idAct"
      WHERE a."idAp" = ${data.apprenticeId}
        AND a."idGr" = ${data.groupId}
        AND i."fecha" BETWEEN ${data.startDate} AND ${data.endDate}
      GROUP BY a."idAp", a."idGr"
       `
       console.log(artist)
       return artist[0]?ArtistWithIncomeDto.fromQueryResult(artist[0]):null
  }

  async  getIncomeGeneratedInGroups(data: RequestArtistWithIncomeDto): Promise<ArtistWithIncomeDto|null> {
     const artist= await this.db.$queryRaw`
          SELECT 
        a."idAp" as "apprenticeId",
        a."idGr"as "groupId",
        SUM(i."monto" / g."Nomiembros") as "TotalIncome"
      FROM "Artista" a
       JOIN "ArtistaEnGrupo" ag ON a."idGr" = ag."idGrupoDebut" And a."idAp"=ag."idAp"
       JOIN "Grupo" g On ag."idGr" = g."id"
       JOIN "PersonasEnActividad" pea ON ag."idGr" = pea."idGrupos"
       JOIN "Actividad" act ON pea."idAct" = act."id"
       JOIN "Ingreso" i ON act."id" = i."idAct"
      WHERE a."idAp" = ${data.apprenticeId}
        AND a."idGr" = ${data.groupId}
        AND i."fecha" BETWEEN ${data.startDate} AND ${data.endDate}
      GROUP BY a."idAp", a."idGr"
      `
       
      return artist[0]?ArtistWithIncomeDto.fromQueryResult(artist[0]):null
  }

  async getBestAlbums(data: RequestArtistWithIncomeDto): Promise<ArtistWithSuccesDto[]|null> {
        const bestAlbums = await this.db.$queryRaw`

         SELECT 
       ala."idAp",
       ala."idGr",
       alb."id" as "albumId",
       alb."titulo",
       alb."NoCopiasVendidas",
       alb."fechaLanzamiento",
       Count(p."id") as "numeroPremios"
       From "ArtistaLanzaAlbum" ala
       Join "Album" alb On ala."idAlb"=alb."id"
       Join "AlbumPremiado" ap On alb."id"=ap."idAlb"
       Join "Premio" p On ap."idPremio"= p."id"
       Where ala."idAp"=${data.apprenticeId} And ala."idGr"=${data.groupId}
       AND alb."fechaLanzamiento" BETWEEN ${data.startDate} AND ${data.endDate}
        GROUP BY ala."idAp", ala."idGr", alb."id", alb."titulo", 
               alb."NoCopiasVendidas", alb."fechaLanzamiento"
      ORDER BY alb."NoCopiasVendidas" DESC
      LIMIT 5
  `;
      return bestAlbums? ArtistWithSuccesDto.fromQueryResultArray(bestAlbums):null
  }

  getBestSongs(data: RequestArtistWithIncomeDto): Promise<ArtistWithSuccesDto[] | null> {
    throw new Error("Method not implemented.");
  }

   async getWhoChangeAgencyAndGroup(): Promise<Artist[] | null> {
      const artists =await this.db.artista.findMany({
         include:{
                         Contrato: {
                orderBy: {
                    fechaInicio: 'asc'
                },
                include: {
                    Agencia: true
                }
            },HistorialGrupos: {
                orderBy: {
                    fechaInicio: 'asc'
                },
                include: {
                    grupo: true
                }
            },          aprendiz:{
                 include:{
                  Agencia:{
                    include:{
                      agencia:true
                    }
                  }
                 }
                  
              }
         }
      })
      const eligibleArtists = artists.filter((artist:any) => {
         
        const uniqueAgencies = new Set(
            artist.Contrato.map((c:any) => c.idAg)
        );
        const hasMultipleAgencyChanges = uniqueAgencies.size >= 2;

         
        const uniqueGroups = new Set(
            artist.HistorialGrupos.map((h:any) => h.idGr)
        );
        const hasMultipleGroups = uniqueGroups.size > 1;

        return hasMultipleAgencyChanges && hasMultipleGroups;
    });
      return eligibleArtists ? ArtistResponseDto.toEntitiesForManager(eligibleArtists):null;
  }
   



}