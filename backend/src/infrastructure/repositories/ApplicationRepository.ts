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
      where: 
      { 
        id: idApplication,
        estado: "PENDIENTE"
      },
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
      where: 
      { 
        id: idApplication,
        estado: "PENDIENTE"
      },
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

  async createFromApplication(dto: ApplicationCreateGroupDTO,applicationId: number): Promise<Group> {
    
    // Verificar si la solicitud es valida o existe 
    const application = await this.db.Solicitud.findUnique({
      where:{
        id: applicationId
      }
    });

    if(!application){
      throw new Error("Solicitud no encontrada");
    }

    if(application.estado == "TERMINADA"){
      throw new Error("Solicitud ya aceptada");
    }

    // Crear grupo
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
  
    const apprentices = await this.db.AprendizSolicitaGrupo.findMany({
      where: {
        idSolicitud: applicationId,
        estado: "ACEPTADO"
      },
    });

    const artists = await this.db.ArtistaSolicitaGrupo.findMany({
      where: {
        idSolicitud: applicationId,
        estado: "ACEPTADO"
      },
    });

    const totalMembers = apprentices.length + artists.length;

    if (totalMembers < 2) {
     throw new Error("La solicitud no tiene suficientes miembros aceptados. " +
      "Se requiere al menos 2 personas (aprendices o artistas) para crear un grupo."
     );
    }
    //  APRENDICES → ARTISTAS
    for (const a of apprentices) {
  
      // (opcional pero sano)
      const aprendizExists = await this.db.Aprendiz.findUnique({
        where: { id: a.idAp },
      });
  
      if (!aprendizExists) {
        throw new Error(`Aprendiz ${a.idAp} no existe`);
      }
  
      //  Crear artista
      await this.db.Artista.create({
        data: {
          idAp: a.idAp,
          idGr: group.id,
          idSolicitud: applicationId,
          nombreArtistico: `Artista ${a.idAp}`,
          fechaDebut: dto.debut,
          estadoArtista: "ACTIVO",
        },
      });
  
      //  Historial artista → grupo
      await this.db.ArtistaEnGrupo.create({
        data: {
          idAp: a.idAp,
          idGrupoDebut: group.id,
          idGr: group.id,
          fechaInicio: dto.debut,
          rol: a.rol,
        },
      });
  
    }

    //  ARTISTAS EXISTENTES → NUEVO GRUPO

    for (const a of artists) {

    const { idAp, idGr: oldGroupId, rol } = a;

    //  Cerrar historial activo en grupo viejo
    await this.db.ArtistaEnGrupo.updateMany({
      where: {
        idAp,
        idGr: oldGroupId,
        fechaFinalizacion: null,
      },
      data: {
        fechaFinalizacion: new Date(),
      },
    });

    //  Obtener artista actual
    const artistaExistente = await this.db.Artista.findUnique({
      where: {
        idAp_idGr: {
          idAp,
          idGr: oldGroupId,
        },
      },
    });

    if (!artistaExistente) {
      throw new Error(
        `No existe el artista con idAp=${idAp} en grupo ${oldGroupId}`
      );
    }

    const idGrupoOriginal = artistaExistente.idGr;

    //  NUEVO HISTORIAL (MIENTRAS FK ES VÁLIDA)
    await this.db.ArtistaEnGrupo.create({
      data: {
        idAp,
        idGrupoDebut: idGrupoOriginal, // sigue existiendo
        idGr: group.id,
        fechaInicio: new Date(),
        rol,
      },
    });
 
  }

  //terminar ya con la solicitud 
    await this.db.Solicitud.update({
      where: { id: applicationId },
      data: { estado: "TERMINADA" },
    });

  //#region Rechazar a los artistas y aprendices en pendiente
    await this.db.AprendizSolicitaGrupo.updateMany({
      where: {
        idSolicitud: applicationId,
        estado: "PENDIENTE"
      },
      data:{
        estado: "RECHAZADO"
      },
    });

    await this.db.ArtistaSolicitaGrupo.updateMany({
      where: {
        idSolicitud: applicationId,
        estado: "PENDIENTE"
      },
      data:{
        estado: "RECHAZADO"
      },
    });
  //#endregion


    const groupWithRelations = await this.db.Grupo.findUnique({
      where: { id: group.id },
      include: {
        concepto: true,
        conceptoVisual: true,
        Agencias: true,
        Artista: { include: { aprendiz: true } },
        HistorialArtistas: true,
      },
    });
  
    //console.log(groupWithRelations);
    return GroupResponseDTO.toEntity(groupWithRelations);
  }
 

  private async checkCreatorCanCreateApplication(idApprentice: number,idGroup: number | undefined): Promise<void> {
  
    // ES APRENDIZ
    if (idGroup === undefined) {
      const acceptedRequest = await this.db.AprendizSolicitaGrupo.findFirst({
        where: {
          idAp: idApprentice,
          estado: "ACEPTADO",
        },
      });
  
      if (acceptedRequest) {
        throw new Error(
          "El aprendiz ya tiene una solicitud aceptada y no puede crear otra"
        );
      }
  
      return;
    }
  
    // ES ARTISTA
  
    // Verificar que sea SOLISTA
    const activeGroup = await this.db.ArtistaEnGrupo.findFirst({
      where: {
        idAp: idApprentice,
        idGr: idGroup,
        fechaFinalizacion: null,
      },
    });
  
    if (activeGroup) {
      throw new Error(
        "El artista no es solista y no puede crear una nueva solicitud"
      );
    }
  
    // Verificar que no tenga solicitud aceptada
    const acceptedArtistRequest =
      await this.db.ArtistaSolicitaGrupo.findFirst({
        where: {
          idAp: idApprentice,
          idGr: idGroup,
          estado: "ACEPTADO",
        },
      });
  
    if (acceptedArtistRequest) {
      throw new Error(
        "El artista ya tiene una solicitud aceptada y no puede crear otra"
      );
    }
  }

  async createRol(data: CreateRolApplicationDto): Promise<Application> {

    // chequeo sobre aprendiz y solista
    await this.checkCreatorCanCreateApplication(data.idApprentice,data.idGroup);

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
  
// NORMALIZAR ARRAYS (forzar rol)

const apprentices: Array<[number, string]> = (data.apprentices ?? []).map(
  (a: any) => {
    // viene como [idAp, rol]
    if (Array.isArray(a) && a.length === 2) {
      return [a[0], a[1]];
    }

    // viene como idAp suelto
    return [a, "MIEMBRO"];
  }
);

const artists: Array<[number, number, string]> = (data.artists ?? []).map(
  (a: any) => {
    // viene como [idAp, idGr, rol]
    if (Array.isArray(a) && a.length === 3) {
      return [a[0], a[1], a[2]];
    }

    // viene como [idAp, idGr]
    return [a[0], a[1], "MIEMBRO"];
  }
);
  
      // AGREGAR CREADOR COMO LÍDER
      if (!data.idGroup) {
        // creador es APRENDIZ
        const exists = apprentices.some(([idAp]) => idAp === data.idApprentice);
  
        if (!exists) {
          apprentices.push([data.idApprentice, "LIDER"]);
        }
      } else {
        // creador es ARTISTA
        const exists = artists.some(
          ([idAp, idGr]) =>
            idAp === data.idApprentice && idGr === data.idGroup
        );
  
        if (!exists) {
          artists.push([data.idApprentice, data.idGroup, "LIDER"]);
        }
      }
  
      // CREAR SOLICITUD
      const application = await this.db.Solicitud.create({
        data: {
          nombreGrupo: data.groupName,
          idAgencia: idAgency,
          idConcepto: idConcept,
          estado: data.status ?? "PENDIENTE",
  
          //  CONEXIONES 
          AprendizMiembro: {
            connect: apprentices.map(([idAp]) => ({ id: idAp })),
          },
  
          ArtistaMiembro: {
            connect: artists.map(([idAp, idGr]) => ({
              idAp_idGr: { idAp, idGr },
            })),
          },
  
          //  SOLICITUDES CON ROL 
          SolicitudGrupoAprendiz: {
            create: apprentices.map(([idAp, rol]) => ({
              idAp,
              idAg: idAgency,
              rol,
              estado: idAp === data.idApprentice ? "ACEPTADO" : "PENDIENTE",
            })),
          },
  
          SolicitudGrupoArtista: {
            create: artists.map(([idAp, idGr, rol]) => ({
              idAp,
              idGr,
              idAg: idAgency,
              rol,
              estado: idAp === data.idApprentice ? "ACEPTADO" : "PENDIENTE",
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
  
    const concept = await this.db.Concepto.findUnique({
      where: { id: idConcept },
    });
  
    const agency = await this.db.Agencia.findUnique({
      where: { id: idAgency },
    });
  
    if (!agency || !concept) {
      throw new Error("Agency or Concept not found");
    }
  
    const application = await this.db.Solicitud.create({
      data: {
        nombreGrupo: data.groupName,
        idAgencia: idAgency,
        idConcepto: idConcept,
        estado: data.status ?? "PENDIENTE",
  
        // =========================
        // RELACIÓN MIEMBROS
        // =========================
        AprendizMiembro: {
          connect: data.apprentices.map(([idAp]) => ({
            id: idAp,
          })),
        },
  
        ArtistaMiembro: {
          connect: data.artists.map(([idAp, idGr]) => ({
            idAp_idGr: { idAp, idGr },
          })),
        },
  
        // =========================
        // SOLICITUDES (CON ROL)
        // =========================
        SolicitudGrupoAprendiz: {
          create: data.apprentices.map(([idAp, rol]) => ({
            idAp,
            idAg: idAgency,
            rol,
            estado: "PENDIENTE",
          })),
        },
  
        SolicitudGrupoArtista: {
          create: data.artists.map(([idAp, idGr, rol]) => ({
            idAp,
            idGr,
            idAg: idAgency,
            rol,
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