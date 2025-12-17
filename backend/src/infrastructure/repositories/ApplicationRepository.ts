import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import { UnitOfWork } from "../PrismaUnitOfWork";
import type { IApplicationRepository } from "../../application/interfaces/repositories/IApplicationRepository";
import { Application, Apprentice } from "../../domain";
import { ApplicationResponseDto } from "../../application/dtos/application(solicitud)/ApplicationResponseDto";
import type { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";
import type { UpdateApplicationDto } from "../../application/dtos/application(solicitud)/UpdateApplicationDto";
import { CreateGroupUseCase } from '../../application/usesCase/group/CreateGroupUseCase';
import type { ApplicationCreateGroupDTO } from "../../application/dtos/application(solicitud)/ApplicationCreateGroupDTO";
import type { CreateRolApplicationDto } from "../../application/dtos/application(solicitud)/CreateRolApplicationDto";
import type { Artist } from "../../domain/entities/Artist";
import { ArtistResponseDto } from "../../application/dtos/artist/ArtistResponseDto";
import { ApprenticeResponseDto } from "../../application/dtos/apprentice/ApprenticeResponseDto";
import { GroupResponseDTO } from "../../application/dtos/group/GroupResponseDTO";
import type { Group } from "../../domain/entities/Group";



@injectable()
export class ApplicationRepository implements IApplicationRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork,
  ) {}


  private get db() {
    return this.unitOfWork.getTransaction();
  }

  async getApprenticesWhithoutApplication(): Promise<Apprentice[]> {
    const apprentices = await this.db.Aprendiz.findMany({
      where: {
        SolicitudGrupo: {
          none: {
            estado: "ACEPTADO",
          },
        },
      },
    });
  
    return ApprenticeResponseDto.toEntities(apprentices);
  }

  async apprenticeDecisionByApplication(idApplication: number,idApprentice: number,decision: boolean): Promise<void> {
  
    const solicitud = await this.db.Solicitud.findUnique({
      where: { id: idApplication },
      select: { idAgencia: true },
    });
  
    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }
  
    const idAg = solicitud.idAgencia;
  
    const solicitudAprendiz = await this.db.AprendizSolicitaGrupo.findUnique({
      where: {
        idAp_idAg_idSolicitud: {
          idAp: idApprentice,
          idAg,
          idSolicitud: idApplication,
        },
      },
    });
  
    if (!solicitudAprendiz) {
      throw new Error("El aprendiz no pertenece a esta solicitud");
    }
  
    if (solicitudAprendiz.estado !== "PENDIENTE") {
      throw new Error("Este aprendiz ya fue evaluado");
    }
  
    await this.db.AprendizSolicitaGrupo.update({
      where: {
        idAp_idAg_idSolicitud: {
          idAp: idApprentice,
          idAg,
          idSolicitud: idApplication,
        },
      },
      data: {
        estado: decision ? "ACEPTADO" : "RECHAZADO",
      },
    });
  
    const [aprendices, artistas] = await Promise.all([
      this.db.AprendizSolicitaGrupo.findMany({
        where: { idSolicitud: idApplication },
        select: { estado: true },
      }),
      this.db.ArtistaSolicitaGrupo.findMany({
        where: { idSolicitud: idApplication },
        select: { estado: true },
      }),
    ]);
  
    const estados = [...aprendices, ...artistas].map(e => e.estado);
  
    if (estados.length > 0 && estados.every(e => e === "ACEPTADO")) {
      await this.db.Solicitud.update({
        where: { id: idApplication },
        data: { estado: "APROBADO" },
      });
    }
  
    if (estados.length > 0 && estados.every(e => e === "RECHAZADO")) {
      await this.db.Solicitud.update({
        where: { id: idApplication },
        data: { estado: "RECHAZADO" },
      });
    }
  }

  async artistDecisionByApplication(idApplication: number,idApprentice: number,idGroup: number,decision: boolean): Promise<void> {
  
    const solicitud = await this.db.Solicitud.findUnique({
      where: { id: idApplication },
      select: { idAgencia: true },
    });
  
    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }
  
    const idAg = solicitud.idAgencia;
  
    const solicitudArtista = await this.db.ArtistaSolicitaGrupo.findUnique({
      where: {
        idAp_idGr_idAg_idSolicitud: {
          idAp: idApprentice,
          idGr: idGroup,
          idAg,
          idSolicitud: idApplication,
        },
      },
    });
  
    if (!solicitudArtista) {
      throw new Error("El artista no pertenece a esta solicitud");
    }
  
    if (solicitudArtista.estado !== "PENDIENTE") {
      throw new Error("Este artista ya fue evaluado");
    }
  
    await this.db.ArtistaSolicitaGrupo.update({
      where: {
        idAp_idGr_idAg_idSolicitud: {
          idAp: idApprentice,
          idGr: idGroup,
          idAg,
          idSolicitud: idApplication,
        },
      },
      data: {
        estado: decision ? "ACEPTADO" : "RECHAZADO",
      },
    });
  
    const [aprendices, artistas] = await Promise.all([
      this.db.AprendizSolicitaGrupo.findMany({
        where: { idSolicitud: idApplication },
        select: { estado: true },
      }),
      this.db.ArtistaSolicitaGrupo.findMany({
        where: { idSolicitud: idApplication },
        select: { estado: true },
      }),
    ]);
  
    const estados = [...aprendices, ...artistas].map(e => e.estado);
  
    if (estados.length > 0 && estados.every(e => e === "ACEPTADO")) {
      await this.db.Solicitud.update({
        where: { id: idApplication },
        data: { estado: "APROBADO" },
      });
    }
  
    if (estados.length > 0 && estados.every(e => e === "RECHAZADO")) {
      await this.db.Solicitud.update({
        where: { id: idApplication },
        data: { estado: "RECHAZADO" },
      });
    }
  }

  async soloistsArtistWhithoutApplication(): Promise<Artist[]> {

    const artists = await this.db.artista.findMany({
      where: {
        HistorialGrupos: {
          every: {
            fechaFinalizacion: { not: null },
          },
        },
        SolicitudGrupo: {
          none: {
            estado: "ACEPTADO",
          },
        },
      },
      include: {
        HistorialGrupos: {
          include: {
            grupo: true,
          },
        },
        aprendiz: {
          include: {
            Agencia: {
              include: {
                agencia: true,
              },
            },
          },
        },
      },
    });
  
    return ArtistResponseDto.toEntities(artists);
  }

  async createFromApplication(dto: ApplicationCreateGroupDTO, applicationId: number):Promise<Group> {
    // Crear el grupo
    const group = await this.db.Grupo.create({
      data: {
        nombreCompleto: dto.groupName,
        fechaDebut: dto.debut,
        estadoGrupo: "ACTIVO",
        idConcepto: dto.conceptId,
        idConceptoVisual: dto.visualConceptId,
        Nomiembros: dto.memberCount,
        Agencias: { connect: { id: dto.agencyId } },
      },
    });
  
    const apprentices: number[] = Array.isArray(dto.apprentices) ? dto.apprentices : [];
    const artists: [number, number][] = Array.isArray(dto.artists) ? dto.artists : [];
  
    // Crear Aprendices como Artistas y sus relaciones
    for (let i = 0; i < apprentices.length; i++) {
      const apprenticeId = apprentices[i];
      const role = dto.roles?.[i] ?? "Miembro";
  
      const existingArtist = await this.db.Artista.findFirst({
        where: { idAp: apprenticeId },
      });
  
      if (existingArtist) {
        throw new Error(`El aprendiz ${apprenticeId} ya debutó como artista.`);
      }
  
      // Crear el Artista
      await this.db.Artista.create({
        data: {
          idAp: apprenticeId,
          idGr: group.id,
          idSolicitud: applicationId,
          nombreArtistico: `Artista ${apprenticeId}`,
          fechaDebut: dto.debut,
          estadoArtista: "ACTIVO",
        },
      });
  
      // Registrar en ArtistaEnGrupo
      await this.db.ArtistaEnGrupo.create({
        data: {
          idAp: apprenticeId,
          idGrupoDebut: group.id,
          idGr: group.id,
          fechaInicio: dto.debut,
          rol: role,
        },
      });
  
      // Registrar en SolicitudGrupoAprendiz
      await this.db.AprendizSolicitaGrupo.create({
        data: {
          idAp: apprenticeId,
          idAg: dto.agencyId,
          idSolicitud: applicationId,
          estado: "ACEPTADO",
        },
      });
    }
  
    for (let j = 0; j < artists.length; j++) {
      const tuple = artists[j];
      if (!tuple) continue; // <-- evita destructuring de undefined
    
      const [idAp, oldGroupId] = tuple;
    
      if (!idAp || !oldGroupId) continue;
    
      const role = dto.roles?.[apprentices.length + j] ?? "Miembro";
    
      // Registrar en ArtistaEnGrupo
      await this.db.ArtistaEnGrupo.create({
        data: {
          idAp,
          idGrupoDebut: oldGroupId,
          idGr: group.id,
          fechaInicio: dto.debut,
          rol: role,
        },
      });
    
      // Registrar en SolicitudGrupoArtista
      await this.db.ArtistaSolicitaGrupo.create({
        data: {
          idAp,
          idGr: group.id,
          idAg: dto.agencyId,
          idSolicitud: applicationId,
          estado: "ACEPTADO",
        },
      });
    }
  
    // Actualizar estado de la solicitud
    await this.db.Solicitud.update({
      where: { id: applicationId },
      data: { estado: "TERMINADA" },
    });
  
    return GroupResponseDTO.toEntity(group);
  }
 

  async createRol(data: CreateRolApplicationDto): Promise<Application> {
    try {
      const idAgency = Number(data.idAgency);
      const idConcept = Number(data.idConcept);
  
      const concept = await this.db.Concepto.findUnique({
        where: { id: idConcept },
      });
  
      const agency = await this.db.Agencia.findUnique({
        where: { id: idAgency },
      });
  
      if (!agency || !concept) {
        throw new Error("Agency or Concept not found");
      }
  
      // ============================
      // ROLES → asegurar LIDER
      // ============================
      const roles = data.roles.includes("LIDER")
        ? data.roles
        : [...data.roles, "LIDER"];
  
      // ============================
      // CLONAR ARRAYS
      // ============================
      const apprentices = [...(data.apprentices ?? [])];
      const artists = [...(data.artists ?? [])];
  
      // ============================
      // AGREGAR AL CREADOR
      // ============================
  
      if (!data.idGroup) {
        // 👉 creador es APRENDIZ
        if (!apprentices.includes(data.idApprentice)) {
          apprentices.push(data.idApprentice);
        }
      } else {
        // 👉 creador es ARTISTA
        const exists = artists.some(
          ([idAp, idGr]) =>
            idAp === data.idApprentice && idGr === data.idGroup
        );
  
        if (!exists) {
          artists.push([data.idApprentice, data.idGroup]);
        }
      }
  
      // ============================
      // CREAR SOLICITUD
      // ============================
      const application = await this.db.Solicitud.create({
        data: {
          nombreGrupo: data.groupName,
          idAgencia: idAgency,
          idConcepto: idConcept,
          roles,
          estado: data.status ?? "PENDIENTE",
  
          // --------- CONEXIONES ---------
          AprendizMiembro: {
            connect: apprentices.map((idAp) => ({ id: idAp })),
          },
  
          ArtistaMiembro: {
            connect: artists.map(([idAp, idGr]) => ({
              idAp_idGr: { idAp, idGr },
            })),
          },
  
          // --------- TABLAS PUENTE ---------
          SolicitudGrupoAprendiz: {
            create: apprentices.map((idAp) => ({
              idAp,
              idAg: idAgency,
              estado: "PENDIENTE",
            })),
          },
  
          SolicitudGrupoArtista: {
            create: artists.map(([idAp, idGr]) => ({
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