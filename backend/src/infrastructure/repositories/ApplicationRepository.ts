import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import { UnitOfWork } from "../PrismaUnitOfWork";
import type { IApplicationRepository } from "../../application/interfaces/repositories/IApplicationRepository";
import { Application } from "../../domain";
import { ApplicationResponseDto } from "../../application/dtos/application(solicitud)/ApplicationResponseDto";
import type { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";
import type { UpdateApplicationDto } from "../../application/dtos/application(solicitud)/UpdateApplicationDto";
import { CreateGroupUseCase } from '../../application/usesCase/group/CreateGroupUseCase';
import type { ApplicationCreateGroupDTO } from "../../application/dtos/application(solicitud)/ApplicationCreateGroupDTO";
import type { CreateRolApplicationDto } from "../../application/dtos/application(solicitud)/CreateRolApplicationDto";



@injectable()
export class ApplicationRepository implements IApplicationRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork,
    @inject(Types.CreateGroupUseCase) private createGroupUseCase: CreateGroupUseCase
  ) {}
 

  private get db() {
    return this.unitOfWork.getTransaction();
  }

  async createFromApplication(dto: ApplicationCreateGroupDTO, applicationId: number) {

    const group = await this.db.Grupo.create({
      data: {
        nombreCompleto: dto.groupName,
        fechaDebut: dto.debut,
        estadoGrupo: "Activo",
        idConcepto: dto.conceptId,
        idConceptoVisual: dto.visualConceptId,
        Nomiembros: dto.memberCount,
        Agencias: { connect: { id: dto.agencyId } }
      }
    });
  
    for (let i = 0; i < dto.apprentices.length; i++) {
      const apprenticeId = dto.apprentices[i];
      const role = dto.roles[i] ?? "Miembro";
  
      const existingArtist = await this.db.Artista.findFirst({
        where: { idAp: apprenticeId }
      });
  
      if (existingArtist) {
        throw new Error(`El aprendiz ${apprenticeId} ya debutó como artista.`);
      }
  
      await this.db.Artista.create({
        data: {
          idAp: apprenticeId,
          idGr: group.id,
          idSolicitud: applicationId, 
          nombreArtistico: `Artista ${apprenticeId}`,
          fechaDebut: dto.debut,
          estadoArtista: "Activo",
  
        }
      });
  
      await this.db.ArtistaEnGrupo.create({
        data: {
          idAp: apprenticeId,
          idGrupoDebut: group.id,
          idGr: group.id,
          fechaInicio: dto.debut,
          rol: role
        }
      });
    }
  
    const existingArtists: [number, number][] = dto.artists ?? [];
  
    for (let j = 0; j < existingArtists.length; j++) {
      const tuple = existingArtists[j];
      if (!tuple) continue;
  
      const [idAp, oldGroupId] = tuple;
  
      const role = dto.roles[dto.apprentices.length + j] ?? "Miembro";
  
      await this.db.ArtistaEnGrupo.create({
        data: {
          idAp,
          idGrupoDebut: oldGroupId,
          idGr: group.id,
          fechaInicio: dto.debut,
          rol: role
        }
      });
    }


    await this.db.Solicitud.update({
      where: { id: applicationId },
      data: { estado: "Terminada" }
    });
  
    return group;
  }
 

  async createRol(data: CreateRolApplicationDto): Promise<Application> {
    try {
      const idAgency = Number(data.idAgency);
      const idConcept = Number(data.idConcept);
      const idAp = Number(data.idApprentice);
      const idGr = data.idGroup ? Number(data.idGroup) : null;
  
      const concept = await this.db.Concepto.findUnique({
        where: { id: idConcept },
      });
  
      const agency = await this.db.Agencia.findUnique({
        where: { id: idAgency },
      });
  
      if (!agency || !concept) {
        throw new Error("Agency or Concept not found");
      }
  
      const roles = data.roles.includes("LIDER")
        ? data.roles
        : [...data.roles, "LIDER"];
  
      const application = await this.db.Solicitud.create({
        data: {
          nombreGrupo: data.groupName,
          idAgencia: idAgency,
          idConcepto: idConcept,
          roles,
          estado: data.status ?? "PENDIENTE",
  
          
          ...(idGr === null && {
            AprendizMiembro: {
              connect: { id: idAp },
            },
            SolicitudGrupoAprendiz: {
              create: {
                idAp,
                idAg: idAgency,
                estado: "PENDIENTE",
              },
            },
          }),
  
         
          ...(idGr !== null && {
            ArtistaMiembro: {
              connect: {
                idAp_idGr: { idAp, idGr },
              },
            },
            SolicitudGrupoArtista: {
              create: {
                idAp,
                idGr,
                idAg: idAgency,
                estado: "PENDIENTE",
              },
            },
          }),
        },
  
        include: {
          AprendizMiembro: true,
          ArtistaMiembro: true,
          SolicitudGrupoAprendiz: true,
          SolicitudGrupoArtista: true,
        },
      });
  
      return ApplicationResponseDto.toEntity(application);
  
    } catch (error: any) {
      console.error("Error creating role application:", error);
      throw new Error(error?.message || "Error creating role application");
    }
  }

  
  async create(data: CreateApplicationDto): Promise<Application> {
    const idAgency = Number(data.idAgency);
    const idConcept = Number(data.idConcept);
  
    const concept = await this.db.Concepto.findUnique({ where: { id: idConcept } });
    const agency = await this.db.Agencia.findUnique({ where: { id: idAgency } });
  
    if (!agency || !concept) {
      throw new Error("Agency or Concept not found");
    }
  
    const application = await this.db.Solicitud.create({
      data: {
        nombreGrupo: data.groupName,
        idAgencia: idAgency,
        idConcepto: idConcept,
        roles: data.roles,
        estado: "PENDIENTE",
  
        AprendizMiembro: {
          connect: data.apprentices.map(idAp => ({ id: idAp })),
        },
  
        ArtistaMiembro: {
          connect: data.artists.map(([idAp, idGr]) => ({
            idAp_idGr: { idAp, idGr },
          })),
        },
  
        SolicitudGrupoAprendiz: {
          create: data.apprentices.map(idAp => ({
            idAp,
            idAg: idAgency,
            estado: "PENDIENTE",
          })),
        },
  
        SolicitudGrupoArtista: {
          create: data.artists.map(([idAp, idGr]) => ({
            idAp,
            idGr,
            idAg: idAgency,
            estado: "PENDIENTE",
          })),
        },
      },
  
      include: {
        AprendizMiembro: true,
        ArtistaMiembro: true,
        SolicitudGrupoAprendiz: true,
        SolicitudGrupoArtista: true,
      },
    });
  
    return ApplicationResponseDto.toEntity(application);
  }



    async findById(id: any): Promise<Application | null> {
      id = Number(id);
    
      const application = await this.db.Solicitud.findUnique({
        where: { id },
        include: {
          AprendizMiembro: {
            select: {
              id: true,
              nombreCompleto: true
            }
          },
          ArtistaMiembro: {
            orderBy: { idAp: "asc" },
            include: {
              aprendiz: {
                select: {
                  nombreCompleto: true
                }
              }
            }
          }
        }
      });
    
      if (!application) {
        throw new Error("Application not found");
      }
    
      return ApplicationResponseDto.toEntity(application);
    }
    

    async update(id: string, data: Partial<UpdateApplicationDto>): Promise<Application> {
        const application = await this.db.Solicitud.update({
          where: { id: Number(id) },
          data: {
            nombreGrupo:data.groupName,
            roles:data.roles,
            estado:data.status,
          },
        });
        return ApplicationResponseDto.toEntity(application);
      }


      async delete(id: string): Promise<void> {
        const solicitudId = Number(id);
      
        await this.db.$transaction([
          this.db.AprendizSolicitaGrupo.deleteMany({
            where: { idSolicitud: solicitudId },
          }),
      
          this.db.ArtistaSolicitaGrupo.deleteMany({
            where: { idSolicitud: solicitudId },
          }),
      
          this.db.Solicitud.delete({
            where: { id: solicitudId },
          }),
        ]);
      }

    async findAll(): Promise<Application[]> {
  const applications = await this.db.Solicitud.findMany({
    include: {
      AprendizMiembro: {
        select: {
          id: true,
          nombreCompleto: true
        }
      },
      ArtistaMiembro: {
        orderBy: { idAp: "asc" },
        include: {
          aprendiz: {
            select: {
              nombreCompleto: true
            }
          }
        }
      }
    }
  });

  return ApplicationResponseDto.toEntities(applications);
}


  
}