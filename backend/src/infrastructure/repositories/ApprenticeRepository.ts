import type { CreateApprenticeDto } from "../../application/dtos/apprentice/CreateApprenticeDto";
import { ApprenticeResponseDto } from "../../application/dtos/apprentice/ApprenticeResponseDto";
 
import type { IApprenticeRepository } from "../../application/interfaces/repositories/IApprenticeRepository";
import { Apprentice } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { Status } from "../../domain/enums/ApprenticeStatus";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
 

@injectable()
export class ApprenticeRepository implements IApprenticeRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}


     private get db() {
    return this.unitOfWork.getTransaction();
  }
    
   async create(data: CreateApprenticeDto): Promise<Apprentice> {
         
         
        
        const apprentice= await this.db.Aprendiz.create({
            data:{
                nombreCompleto:data.name,
                fechaNacimiento:new Date(data.dateOfBirth),
                edad:data.age,
                nivelEntrenamiento:data.trainingLv,
                estadoAprendiz:data.status              
            }
        })
        
        
        return ApprenticeResponseDto.toEntity(apprentice)
    }
    async findById(id: any): Promise<Apprentice | null> {
         id=(Number)(id)
        const apprentice=await this.db.Aprendiz.findUnique({
           where:{id}
        })
        return apprentice ? ApprenticeResponseDto.toEntity(apprentice) : null
    }

    async update(id: string, data: Partial<CreateApprenticeDto>): Promise<Apprentice> {
        const apprentice = await this.db.Aprendiz.update({
          where: { id: Number(id) },
          data: {
            nombreCompleto:data.name,
            fechaNacimiento:data.dateOfBirth,
            edad:data.age,
            nivelEntrenamiento:data.trainingLv,
            estadoAprendiz:data.status
          },
        });
      
        return ApprenticeResponseDto.toEntity(apprentice);
      }
   async delete(id: string): Promise<void> {
    try {
      await this.db.Aprendiz.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new Error(`Error deleting apprentice with id ${id}: ${error}`);
    }
  }

    async findAll(): Promise<Apprentice[]> {
      const apprentices = await this.db.Aprendiz.findMany();

      return apprentices
  }
}