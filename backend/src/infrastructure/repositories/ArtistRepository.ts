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

    async findById(id:any): Promise<Artist | null> {
      const artist = await this.db.artista.findUnique({
        where:{ idAp_idGr:
          {idAp:id.apprenticeId,
           idGr:id.groupId,
        },
        // include:{
        //     HistorialGrupos:true
        // }
      }})
      return artist ? ArtistResponseDto.toEntity(artist) : null;
  }

    async delete(id:any): Promise<void> {
    
       // Primero eliminar registros en tablas intermedias
    await this.db.artistaEnGrupo.deleteMany({
      where: {
        idAp: id.apprenticeId,
        idGrupoDebut: id.groupId,
      },
    });
    //   await this.db.artistaEnActividad.deleteMany({
    //   where: {
    //     idAp: apprenticeId,
    //     idGr: groupId,
    //   },
    // });

    // await this.db.contrato.deleteMany({
    //   where: {
    //     idAp: apprenticeId,
    //     idGr: groupId,
    //   },
    // });

    // await this.db.artistaLanzaAlbum.deleteMany({
    //   where: {
    //     idAp: apprenticeId,
    //     idGr: groupId,
    //   },
    // });

    // Finalmente eliminar el artista
    await this.db.artista.delete({
      where: {
        idAp_idGr: {
          idAp: id.apprenticeId,
          idGr: id.groupId,
        },
      },
    });
  }

    async update(id:any, data: Partial<UpdateArtistDto>): Promise<Artist> {
        
     const artist = await this.db.artista.update({
                where: {    idAp_idGr: {
                              idAp: id.apprenticeId,
                              idGr: id.groupId
                            }
                       
                      },
                    data: {
                      nombreArtistico:data.ArtistName,
                      fechaDebut:data.DebutDate,
                      estadoArtista:data.Status
                    }
                  });
                  console.log(artist)
                
                  return ArtistResponseDto.toEntity(artist);
      }
    
    async getAll(): Promise<Artist[]> {
        const artists = await this.db.artista.findMany();
        
        return ArtistResponseDto.toEntities(artists)
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

  async getIndividualIncome(data:RequestArtistWithIncomeDto): Promise<ArtistWithIncomeDto> {
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
       
       return ArtistWithIncomeDto.fromQueryResult(artist[0])
  }

  async  getIncomeGeneratedInGroups(data: RequestArtistWithIncomeDto): Promise<ArtistWithIncomeDto> {
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
       
      return ArtistWithIncomeDto.fromQueryResult(artist[0])
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