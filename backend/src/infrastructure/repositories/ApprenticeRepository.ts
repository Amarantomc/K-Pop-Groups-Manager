import type { CreateApprenticeDto } from "../../application/dtos/apprentice/CreateApprenticeDto";
import { ApprenticeResponseDto } from "../../application/dtos/apprentice/ApprenticeResponseDto";
 
import type { IApprenticeRepository } from "../../application/interfaces/repositories/IApprenticeRepository";
import { Apprentice } from "../../domain";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import { Status } from "../../domain/enums/ApprenticeStatus";
 

export class ApprenticeRepository implements IApprenticeRepository
{   
    constructor(
    private prisma: any,
    private unitOfWork: UnitOfWork
  ) {}

     private get db() {
    return this.unitOfWork.getTransaction();
  }
    
   async create(data: CreateApprenticeDto): Promise<Apprentice> {
         
         

        const apprentice= await this.db.apprentice.create({
            data:{
                name:data.name,
                dateOfBirth:data.dateOfBirth,
                age:data.age,
                trainingLv:data.trainingLv,
                status:data.status              
            }
        })
        
        return ApprenticeResponseDto.toEntity(apprentice)
    }
    async findById(id: any): Promise<Apprentice | null> {
         id=(Number)(id)
        const apprentice=await this.db.apprentice.findUnique({
           where:{id}
        })
        return apprentice ? ApprenticeResponseDto.toEntity(apprentice) : null
    }

    async update(id: string, data: Partial<CreateApprenticeDto>): Promise<Apprentice> {
        const apprentice = await this.db.apprentice.update({
          where: { id: Number(id) },
          data: {
            name: data.name,
            dateOfBirth: data.dateOfBirth,
            age: data.age,
            trainingLv: data.trainingLv,
            status: data.status,
          },
        });
      
        return ApprenticeResponseDto.toEntity(apprentice);
      }
   async delete(id: string): Promise<void> {
    try {
      await this.db.apprentice.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new Error(`Error deleting apprentice with id ${id}: ${error}`);
    }
  }
}