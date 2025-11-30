import { inject, injectable } from "inversify";
import type { IActivityRepository } from "../../application/interfaces/repositories/IActivityRepository";
import { Types } from "../di/Types";
import type { IUnitOfWork } from "../../application/interfaces/IUnitOfWork";
import type { CreateActivityDto } from "../../application/dtos/activity/CreateActivityDto";
import type { UpdateActivityDto } from "../../application/dtos/activity/UpdateActivityDto";
import type { Activity } from "../../domain";
import { ActivityResponseDto } from "../../application/dtos/activity/ActivityResponseDto";

@injectable()
export class ActivityRepository implements IActivityRepository {

  constructor( @inject(Types.PrismaClient) private prisma:any,
                @inject(Types.IUnitOfWork) private unitOfWork:IUnitOfWork) {}
   

     private get db() {
    return this.unitOfWork.getTransaction();
  }

   
    async create(data: CreateActivityDto): Promise<Activity> {
        const activity = await this.db.actividad.create({
      data: {
        responsable: data.responsible,
        tipoActividad: data.activityType,
        fecha: new Date(data.date),
        lugar: data.place
      } 
    });
    return ActivityResponseDto.toEntity(activity);
    }
    async findById(id: string): Promise<Activity | null> {
         const activity = await this.db.actividad.findUnique({
      where: { id: Number(id) },
      include: {
        Ingreso: true,
        Artistas: {
          include: {
            artista: true
          }
        }
      }
    });
    return activity ? ActivityResponseDto.toEntity(activity) : null;
    }
async update(id: string, data: Partial<UpdateActivityDto>): Promise<Activity> {
      const activity = await this.db.actividad.update({
      where: { id: Number(id) },
      data,
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
    await this.db.actividad.delete({
      where: { id: activityId }
    });
    }

async getAll(): Promise<Activity[]> {
    const activities = await this.db.actividad.findMany({
      include: {
        Ingreso: true,
        Artistas: {
          include: {
            artista: true
          }
        }
      }
    });
    return ActivityResponseDto.toEntities(activities);
    }
}