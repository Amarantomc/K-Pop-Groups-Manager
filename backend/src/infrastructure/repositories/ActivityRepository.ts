  import { inject, injectable } from "inversify";
  import type { IActivityRepository } from "../../application/interfaces/repositories/IActivityRepository";
  import { Types } from "../di/Types";
  import type { IUnitOfWork } from "../../application/interfaces/IUnitOfWork";
  import type { CreateActivityDto } from "../../application/dtos/activity/CreateActivityDto";
  import type { UpdateActivityDto } from "../../application/dtos/activity/UpdateActivityDto";
  import type { Activity } from "../../domain";
  import { ActivityResponseDto } from "../../application/dtos/activity/ActivityResponseDto";
  import type { ArtistOnActivityDto } from "../../application/dtos/activity/ArtistOnActivityDto";
 

  @injectable()
  export class ActivityRepository implements IActivityRepository {

    constructor(@inject(Types.PrismaClient) private prisma: any,
      @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork) { }

    private get db() {
        return this.unitOfWork.getTransaction();
    }
    
    async cancelExpiredActivities(): Promise<void> {
        const expiredActivities = await this.db.$queryRaw<
          { id: number }[]
        >`
          SELECT id
          FROM "Actividad"
          WHERE estado = 'PENDIENTE'
            AND fecha <= NOW() - INTERVAL '5 days'
        `;
      
        if (!expiredActivities.length) return;
      
        const activityIds = expiredActivities.map((a: { id: any; }) => a.id);
      
        await this.db.$transaction([
          // Rechazar participantes
          this.db.PersonasEnActividad.updateMany({
            where: {
              idAct: { in: activityIds }
            },
            data: {
              aceptado: false
            }
          }),
      
          // // Eliminar ingresos
          // this.db.ingreso.deleteMany({
          //   where: {
          //     idAct: { in: activityIds }
          //   }
          // }),
      
          // Cancelar actividades
          this.db.actividad.updateMany({
            where: {
              id: { in: activityIds }
            },
            data: {
              estado: "CANCELADA"
            }
          })
        ]);
    }

    async acceptedActivity(activityId: number,isAccepted: boolean,apprenticeId: number,groupId: number): Promise<void> {
      
        await this.db.PersonasEnActividad.updateMany({
          where: {
            idAct: activityId,
            idAp: apprenticeId,
            idGr: groupId
          },
          data: {
            aceptado: isAccepted
          }
        });
      
        const totalParticipants = await this.db.PersonasEnActividad.count({
          where: { idAct: activityId }
        });
      
        const acceptedCount = await this.db.PersonasEnActividad.count({
          where: {
            idAct: activityId,
            aceptado: true
          }
        });
      
        const rejectedCount = await this.db.PersonasEnActividad.count({
          where: {
            idAct: activityId,
            aceptado: false
          }
        });
      
        if (acceptedCount === 0 && rejectedCount > 0) {
          await this.db.$transaction([
            this.db.ingreso.deleteMany({
              where: { idAct: activityId }
            }),
            this.db.actividad.update({
              where: { id: activityId },
              data: { estado: "CANCELADA" }
            })
          ]);
          return;
        }
      
        if (acceptedCount === totalParticipants) {
          await this.db.actividad.update({
            where: { id: activityId },
            data: { estado: "ACEPTADA" }
          });
          return;
        }
      
    }

    async create(data: CreateActivityDto): Promise<Activity> {
      const baseDate = new Date(data.date);
      baseDate.setHours(0, 0, 0, 0);
    
      // rango ±5 días
      const from = new Date(baseDate);
      from.setDate(from.getDate() - 5);
      from.setHours(0, 0, 0, 0);
    
      const to = new Date(baseDate);
      to.setDate(to.getDate() + 5);
      to.setHours(23, 59, 59, 999);
    
      const artistIds = data.artists?.map(([idAp]) => idAp) ?? [];
      const groupIds = data.groups ?? [];
    
      // Buscar conflictos primero
      const conflicts = await this.db.actividad.findMany({
        where: {
          fecha: { gte: from, lte: to },
          estado: { not: "CANCELADA" },
          Personas: {
            some: {
              OR: [
                artistIds.length ? { idAp: { in: artistIds } } : undefined,
                groupIds.length ? { idGrupos: { in: groupIds } } : undefined,
              ].filter(Boolean),
            },
          },
        },
        include: { Personas: true },
      });
    
      const conflictArtistIds = new Set<number>();
      const conflictGroupIds = new Set<number>();
    
      for (const act of conflicts) {
        for (const p of act.Personas) {
          if (p.idAp && artistIds.includes(p.idAp)) conflictArtistIds.add(p.idAp);
          if (p.idGrupos && groupIds.includes(p.idGrupos)) conflictGroupIds.add(p.idGrupos);
        }
      }
    
      // Lanzar error simple si hay conflictos
      if (conflictArtistIds.size || conflictGroupIds.size) {
        const artists = conflictArtistIds.size
          ? await this.db.Aprendiz.findMany({
              where: { id: { in: [...conflictArtistIds] } },
              select: { nombreCompleto: true },
            })
          : [];
    
        const groups = conflictGroupIds.size
          ? await this.db.Grupo.findMany({
              where: { id: { in: [...conflictGroupIds] } },
              select: { nombreCompleto: true },
            })
          : [];
    
        throw new Error([
          artists.length ? `Artistas con conflicto: ${artists.map((a: { nombreCompleto: any; }) => a.nombreCompleto).join(", ")}` : null,
          groups.length ? `Grupos con conflicto: ${groups.map((g: { nombreCompleto: any; }) => g.nombreCompleto).join(", ")}` : null,
        ].filter(Boolean).join(" | "));
      }
    
      // Crear actividad solo si no hay conflictos
      const activity = await this.db.actividad.create({
        data: {
          responsable: data.responsible,
          tipoActividad: data.activityType,
          tipoEvento: data.eventType,
          fecha: baseDate,
          lugar: data.place,
      
          Personas: {
            create: [
              ...(data.artists ?? []).map(([idAp, idGr]) => ({
                idAp,
                idGr: idGr ?? null,
                aceptado: null,
              })),
      
              ...(data.groups ?? []).map(idGrupos => ({
                idGrupos,
                aceptado: null,
              })),
            ],
          },
        },
      
        include: {
          Personas: true,
        },
      });
    
      return ActivityResponseDto.toEntity(activity);
    }

    // async findById(id: string): Promise<Activity | null> {
    //   const activity = await this.db.actividad.findUnique({
    //     where: { id: Number(id) },
    //     include: {
    //       Ingreso: true,
    //       Personas: {
    //         include: {
    //           artista: true
    //         }
    //       }
    //     }
    //   });
    //   return activity ? ActivityResponseDto.toEntity(activity) : null;
    // }

    async findById(id: string): Promise<Activity | null> {
      const activity = await this.db.actividad.findUnique({
        where: { id: Number(id) },
        include: {
          Ingreso: true, // ingresos de la actividad
          Personas: {    // participantes
            include: {
              artista: true, // info del artista
              grupos: {      // info del grupo de la persona
                select: {
                  id: true,
                  nombreCompleto: true
                }
              }
            }
          }
        }
      });
    
      return activity ? ActivityResponseDto.toEntity(activity) : null;
    }

    async update(id: string, data: Partial<UpdateActivityDto>): Promise<Activity> {

      const activity = await this.db.actividad.update({
        where: { id: Number(id) },
        data: {
          responsable: data.responsible,
          lugar: data.place,
          fecha: data.date,
          tipoActividad: data.activityType
        },
        include: {
          Ingreso: true,
          Artistas: true
        }
      });


      return ActivityResponseDto.toEntity(activity);

    }

    async delete(id: string): Promise<void> {
      const activityId = Number(id);

      // Eliminar relaciones primero
      await this.db.ingreso.deleteMany({
        where: { idAct: activityId }
      });

      await this.db.artistaEnActividad.deleteMany({
        where: { idAct: activityId }
      });

      await this.db.grupoEnActividad.deleteMany({
        where: { idAct: activityId }
      });

      // Eliminar la actividad
      await this.db.Actividad.delete({
        where: { id: activityId }
      });
    }

    async getAll(): Promise<Activity[]> {
      await this.cancelExpiredActivities();
    
      const activities = await this.db.actividad.findMany({
        include: {
          Ingreso: true,
          Personas: {
            include: {
              artista: true,
              grupos: {
                select: {
                  id: true,
                  nombreCompleto: true
                }
              }
            }
          }
        }
      }); 


      //console.log(activities[18].Personas);

      return ActivityResponseDto.toEntities(activities);
    }

    async findByArtist(apprenticeId: number, groupId: number): Promise<Activity[]> {

      await this.cancelExpiredActivities();

      const activities = await this.db.actividad.findMany({
        where: {
          estado: {
            not: "CANCELADA"
          },
          Personas: {
            some: {
              idAp: apprenticeId,
              idGr: groupId
            }
          }
        }
      });
    
      return ActivityResponseDto.toEntities(activities);
    }

    async addArtist(command: ArtistOnActivityDto): Promise<void> {
      await this.db.artistaEnActividad.create({
        data: {
          idAct: command.activityId,
          idAp: command.apprenticeId,
          idGr: command.groupId,
          aceptado: command.accepted
        }
      })
    }

    async findByGroup(groupId: number): Promise<Activity[] | null> {
      const activities = await this.db.PersonasEnActividad.findMany({
        where: {
          idGrupos: groupId
        },
        include: {
          actividad: true
        }
      })


      return activities ? ActivityResponseDto.toEntities(activities.map((a: any) => a.actividad)) : null
    }

  }