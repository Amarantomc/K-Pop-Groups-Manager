import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import { UnitOfWork } from "../PrismaUnitOfWork";
import type { IApplicationRepository } from "../../application/interfaces/repositories/IApplicationRepository";
import { Application } from "../../domain";
import { ApplicationResponseDto } from "../../application/dtos/application(solicitud)/ApplicationResponseDto";
import type { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";


@injectable()
export class ApplicationRepository implements IApplicationRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}

  private get db() {
    return this.unitOfWork.getTransaction();
  }

    findByAgency(agencyId: number): Promise<Application[] | null> {
        throw new Error("Method not implemented.");
    }
    findByApprentice(apprenticeId: number): Promise<Application[] | null> {
        throw new Error("Method not implemented.");
    }
    findByArtist(artistId: number): Promise<Application[] | null> {
        throw new Error("Method not implemented.");
    }

    
   async create(data: CreateApplicationDto): Promise<Application> {
         
         const application= await this.db.Solicitud.create({
            data:{
                nombreCompleto:data.name,
                descripcion:data.description,
                fechaSolicitud:data.date
            }
        })

        return ApplicationResponseDto.toEntity(application)
    }
    async findById(id: any): Promise<Application | null> {
         id=(Number)(id)
        const application=await this.db.solicitud.findUnique({
           where:{id}
        })
        return application ? ApplicationResponseDto.toEntity(application) : null
    }

    async update(id: string, data: Partial<CreateApplicationDto>): Promise<Application> {
        const application = await this.db.Solicitud.update({
          where: { id: Number(id) },
          data: {
            nombre:data.name,
            descripcion:data.description,
            fechaSolicitud:data.date,
          },
        });
      
        return ApplicationResponseDto.toEntity(application);
      }
   async delete(id: string): Promise<void> {
    
      await this.db.Solicitud.delete({
        where: { id: Number(id) },
      });
      
  }

    async findAll(): Promise<Application[]> {
      const applications = await this.db.Aprendiz.findMany();

      return ApplicationResponseDto.toEntities(applications);
  }

}