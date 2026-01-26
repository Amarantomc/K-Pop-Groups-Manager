import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import { UnitOfWork } from "../PrismaUnitOfWork";
import type { IApplicationRepository } from "../../application/interfaces/repositories/IApplicationRepository";
import { Application, Apprentice } from "../../domain";
import { ApplicationResponseDto } from "../../application/dtos/application(solicitud)/ApplicationResponseDto";
import type { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";
import type { UpdateApplicationDto } from "../../application/dtos/application(solicitud)/UpdateApplicationDto";
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
          none: { estado: "ACEPTADO" },
        },
        Artista: {
          is: null, // Si no hay artista asociado
        },
      },
    });
  
    return ApprenticeResponseDto.toEntities(apprentices);
  }

  async apprenticeDecisionByApplication(idApplication: number,idApprentice: number,decision: boolean): Promise<void> {
  
    const solicitud = await this.db.Solicitud.findFirst({
      where: {
        id: idApplication,
        estado: "PENDIENTE",
      },
    });
  
    if (!solicitud) {
      throw new Error("Solicitud no encontrada o no está pendiente");
    }
  
    const solicitudAprendiz = await this.db.AprendizSolicitaGrupo.findFirst({
      where: {
        idAp: idApprentice,
        idSolicitud: idApplication,
      },
    });
  
    if (!solicitudAprendiz) {
      throw new Error("El aprendiz no pertenece a esta solicitud");
    }

    if (decision) {
      const otraAceptada = await this.db.AprendizSolicitaGrupo.findFirst({
        where: {
          idAp: idApprentice,
          estado: "ACEPTADO",
          idSolicitud: { not: idApplication },
        },
      });
    
      if (otraAceptada) {
        throw new Error(
          "El aprendiz ya tiene otra solicitud aceptada. No puede aceptar dos solicitudes."
        );
      }
    }
  
    // SI ACEPTA → RECHAZAR TODAS LAS DEMÁS
    if (decision) {
      await this.db.AprendizSolicitaGrupo.updateMany({
      where: {
          idAp: idApprentice,
          idSolicitud: { not: idApplication },
        estado: { in: ["ACEPTADO", "PENDIENTE"] },
      },
      data: {
          estado: "RECHAZADO",
      },
    });
    }

    // UPDATE FORZADO DE ESTA SOLICITUD
    await this.db.AprendizSolicitaGrupo.update({
      where: {
        idAp_idAg_idSolicitud: {
          idAp: idApprentice,
          idAg: solicitudAprendiz.idAg,
          idSolicitud: idApplication,
        },
      },
      data: {
        estado: decision ? "ACEPTADO" : "RECHAZADO",
      },
    });
  
    // REEVALUAR ESTADO GLOBAL
  
    const aprendices = await this.db.AprendizSolicitaGrupo.findMany({
      where: { idSolicitud: idApplication },
      select: { estado: true, rol: true },
    });
  
    const artistas = await this.db.ArtistaSolicitaGrupo.findMany({
      where: { idSolicitud: idApplication },
      select: { estado: true, rol: true },
    });
  
    const miembros = [...aprendices, ...artistas];
  
    const lider = miembros.find(m => m.rol === "LIDER");
    const resto = miembros.filter(m => m.rol !== "LIDER");
    
    const solicitudes = await this.db.Solicitud.findMany({
      include: {
        SolicitudGrupoAprendiz: true,
        SolicitudGrupoArtista: true,
      },
    });

    // APROBADO
    // if (miembros.length > 0 && miembros.every(m => m.estado !== "PENDIENTE")) {
    //   await this.db.Solicitud.update({
    //     where: { id: idApplication },
    //     data: { estado: "APROBADO" },
    //   });
    //   return;
    // }

    for (const solicitud of solicitudes) {
      const miembros = [
        ...solicitud.SolicitudGrupoAprendiz,
        ...solicitud.SolicitudGrupoArtista,
      ];
    
      if (
        miembros.length > 0 &&
        miembros.every(m => m.estado !== "PENDIENTE")
      ) {
        await this.db.Solicitud.update({
          where: { id: solicitud.id },
          data: { estado: "APROBADO" },
        });
      }
    }
  
    // RECHAZADO (solo líder aceptado)
    
    // if (
    //   lider?.estado === "ACEPTADO" &&
    //   resto.length > 0 &&
    //   resto.every(m => m.estado === "RECHAZADO")
    // ) {
    //   await this.db.Solicitud.update({
    //     where: { id: idApplication },
    //     data: { estado: "RECHAZADO" },
    //   });
    // }

    for (const solicitud of solicitudes) {
      const miembros = [
        ...solicitud.SolicitudGrupoAprendiz,
        ...solicitud.SolicitudGrupoArtista,
      ];
    
      const lider = miembros.find(m => m.rol === "LIDER");
      const resto = miembros.filter(m => m.rol !== "LIDER");
    
      if (
        lider?.estado === "ACEPTADO" &&
        resto.length > 0 &&
        resto.every(m => m.estado === "RECHAZADO")
      ) {
        await this.db.Solicitud.update({
          where: { id: solicitud.id },
          data: { estado: "RECHAZADO" },
        });
      }
    }


  }

  async artistDecisionByApplication(idApplication: number,idApprentice: number,idGroup: number,decision: boolean): Promise<void> {
  
    const solicitud = await this.db.Solicitud.findFirst({
      where: {
        id: idApplication,
        estado: "PENDIENTE",
      },
    });
  
    if (!solicitud) {
      throw new Error("Solicitud no encontrada o no está pendiente");
    }
  
    const solicitudArtista = await this.db.ArtistaSolicitaGrupo.findFirst({
      where: {
        idAp: idApprentice,
        idSolicitud: idApplication,
      },
    });
  
    if (!solicitudArtista) {
      throw new Error("El artista no pertenece a esta solicitud");
    }
  
    // CHECK: NO PUEDE TENER OTRA ACEPTADA
    if (decision) {
      const otraAceptada = await this.db.ArtistaSolicitaGrupo.findFirst({
        where: {
          idAp: idApprentice,
          estado: "ACEPTADO",
          idSolicitud: { not: idApplication },
        },
      });
  
      if (otraAceptada) {
        throw new Error(
          "El artista ya tiene otra solicitud aceptada. No puede aceptar dos solicitudes."
        );
      }
    }
  
    // SI ACEPTA → RECHAZAR TODAS LAS DEMÁS
    if (decision) {
      await this.db.ArtistaSolicitaGrupo.updateMany({
        where: {
          idAp: idApprentice,
          idSolicitud: { not: idApplication },
          estado: { in: ["ACEPTADO", "PENDIENTE"] },
        },
        data: {
          estado: "RECHAZADO",
        },
      });
    }
  
    // UPDATE FORZADO DE ESTA SOLICITUD
    await this.db.ArtistaSolicitaGrupo.update({
      where: {
        idAp_idGr_idAg_idSolicitud: {
          idAp: idApprentice,
          idGr: idGroup,
          idAg: solicitudArtista.idAg,
          idSolicitud: idApplication,
        },
      },
      data: {
        estado: decision ? "ACEPTADO" : "RECHAZADO",
      },
    });
  
    // REEVALUAR ESTADO GLOBAL
    const aprendices = await this.db.AprendizSolicitaGrupo.findMany({
      where: { idSolicitud: idApplication },
      select: { estado: true, rol: true },
    });
  
    const artistas = await this.db.ArtistaSolicitaGrupo.findMany({
      where: { idSolicitud: idApplication },
      select: { estado: true, rol: true },
    });
  
    const miembros = [...aprendices, ...artistas];
  
    const lider = miembros.find(m => m.rol === "LIDER");
    const resto = miembros.filter(m => m.rol !== "LIDER");
  
    // APROBADO
    if (miembros.length > 0 && miembros.every(m => m.estado === "ACEPTADO")) {
      await this.db.Solicitud.update({
        where: { id: idApplication },
        data: { estado: "APROBADO" },
      });
      return;
    }
  
    // RECHAZADO (solo líder aceptado)
    if (
      lider?.estado === "ACEPTADO" &&
      resto.length > 0 &&
      resto.every(m => m.estado === "RECHAZADO")
    ) {
      await this.db.Solicitud.update({
        where: { id: idApplication },
        data: { estado: "RECHAZADO" },
      });
    }
  }

  async soloistsArtistWhithoutApplication(): Promise<Artist[]> {

    const artists = await this.db.artista.findMany({
      where: {
        estadoArtista: "ACTIVO",
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

    if(application.estado == "COMPLETADA" || application.estado == "RECHAZADO"){
      throw new Error("Solicitud rechazada o ya completada");
    }
    // if(application.estado == "PENDIENTE"){
    //   throw new Error("Solicitud en proceso");
    // }
  
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

    // Crear grupo
    const group = await this.db.Grupo.create({
      data: {
        nombreCompleto: dto.groupName,
        fechaDebut: dto.debut,
        estadoGrupo: "ACTIVO",
        idConcepto: dto.conceptId,
        idConceptoVisual: dto.visualConceptId,
        Nomiembros: totalMembers,
        Agencias: { connect: { id: dto.agencyId } },
      },
    });


    
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

      // Actualizar en tabla aprendiz en agencia
      await this.db.aprendizEnAgencia.updateMany({
        where:{
          idAp: a.idAp,
			    fechaFinalizacion: null,
        },
        data:{
          estado: "ARTISTA",
          fechaFinalizacion: new Date()
        }
      })

      const perfilAprendiz = await this.db.PerfilAprendiz.findUnique({
        where: { aprendizId: a.idAp },
      });

      if (!perfilAprendiz) {
        throw new Error(`Aprendiz ${a.idAp} no tiene PerfilAprendiz`);
      }

      const userId = perfilAprendiz.userId;

      await this.db.PerfilAprendiz.delete({
        where: { userId },
      });

      await this.db.PerfilArtista.create({
        data: {
          userId,
          IdAp: a.idAp,
          IdGr: group.id,
        },
      });

      await this.db.User.update({
        where: { id: userId },
        data: {
          role: "Artist",
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
      data: { estado: "COMPLETADA" },
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
      HistorialArtistas: {
        where: { fechaFinalizacion: null },
        include: {
          artista: {
            include: {
              aprendiz: true,
            },
          },
        },
      },
    },
  });
    
    
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
          SolicitudGrupoAprendiz: {
            include: {
              aprendiz: true,
            },
          },
          SolicitudGrupoArtista: {
            include: {
              artista: {
                include: {
                  aprendiz: true,
                },
              },
            },
          },
        },
      });
  
      return ApplicationResponseDto.toEntity(application);
  
    } catch (error: any) {
      //console.error("Error creating role application:", error);
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
  
        // RELACIÓN MIEMBROS
        AprendizMiembro: {
          connect: data.apprentices!.map(([idAp]) => ({
            id: idAp,
          })),
        },
  
        ArtistaMiembro: {
          connect: data.artists!.map(([idAp, idGr]) => ({
            idAp_idGr: { idAp, idGr },
          })),
        },
  
        // SOLICITUDES (CON ROL)
        SolicitudGrupoAprendiz: {
          create: data.apprentices!.map(([idAp, rol]) => ({
            idAp,
            idAg: idAgency,
            rol,
            estado: "PENDIENTE",
          })),
        },
  
        SolicitudGrupoArtista: {
          create: data.artists!.map(([idAp, idGr, rol]) => ({
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

  async findById(id: string): Promise<Application | null> {
    const application = await this.db.Solicitud.findUnique({
      where: { id: Number(id) },
      include: {
        SolicitudGrupoAprendiz: {
          include: {
            aprendiz: {
              select: {
                id: true,
                nombreCompleto: true,
              },
            },
          },
        },
        SolicitudGrupoArtista: {
          include: {
            artista: {
              include: {
                aprendiz: {
                  select: {
                    nombreCompleto: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  
    if (!application) {
      throw new Error(`Solicitud con id ${id} no existe`);
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
            SolicitudGrupoAprendiz: {
              include: {
                aprendiz: {
                  select: {
                    id: true,
                    nombreCompleto: true,
                  },
                },
              },
            },
            SolicitudGrupoArtista: {
              include: {
                artista: {
                  include: {
                    aprendiz: {
                      select: {
                        nombreCompleto: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      
        return ApplicationResponseDto.toEntities(applications);
  }


  
}