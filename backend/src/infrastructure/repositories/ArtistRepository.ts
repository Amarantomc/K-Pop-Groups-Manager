import { inject, injectable } from "inversify";
import type { IArtistRepository } from "../../application/interfaces/repositories/IArtistRepository";
import { Types } from "../di/Types";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { CreateArtistDto } from "../../application/dtos/artist/CreateArtistDto";
import type { Artist } from "../../domain/entities/Artist";
import { ArtistResponseDto } from "../../application/dtos/artist/ArtistResponseDto";
import type { UpdateArtistDto } from "../../application/dtos/artist/UpdateArtistDto";

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
  async getGroupHistory(apprenticeId: number, groupId: number): Promise<Array<{ groupId: number; role: string; startDate: Date; endDate?: Date; }>> {
        const history = await this.db.artistaEnGrupo.findMany({
      where: {
        idAp: apprenticeId,
        idGrupoDebut: groupId,
      },
    });

    return history.map((h: any) => ({
      groupId: h.idGr,
      role: h.rol,
      startDate: h.fechaInicio,
      endDate: h.fechaFinalizacion,
    }));
  }
 
  async getActivities(apprenticeId: number, groupId: number): Promise<Array<{ activityId: number; accepted: boolean; }>> {
        const activities = await this.db.artistaEnActividad.findMany({
      where: {
        idAp: apprenticeId,
        idGr: groupId,
      },
    });

    return activities.map((a: any) => ({
      activityId: a.idAct,
      accepted: a.aceptado,
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
       }
    }) 
      return artists ? ArtistResponseDto.toEntities(artists):null
  }



}