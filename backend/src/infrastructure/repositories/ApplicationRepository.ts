import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import { UnitOfWork } from "../PrismaUnitOfWork";
import type { IApplicationRepository } from "../../application/interfaces/repositories/IApplicationRepository";
import { Application } from "../../domain";
import { ApplicationResponseDto } from "../../application/dtos/application(solicitud)/ApplicationResponseDto";
import type { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";
import { error } from "console";


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

   async create(data: CreateApplicationDto): Promise<Application> {

    //console.log(data);
    const idAgency = (Number)(data.idAgency);
    const idConcept = (Number)(data.idConcept);
    const concept=await this.db.Concepto.findUnique({
      where:{ id: idConcept}
   });
   console.log(concept);
    const agency=await this.db.Agencia.findUnique({
      where:{ id: idAgency}
   });


  if(!agency || !concept){
    throw new Error("Agency or Concept not found");
  }

         const application= await this.db.Solicitud.create({
            data:{
                nombreGrupo:data.groupName,
                idAgencia:data.idAgency,
                roles:data.roles,
                idConcepto: data.idConcept
            }
        })

        return ApplicationResponseDto.toEntity(application)
    }
    async findById(id: any): Promise<Application | null> {
         id=(Number)(id)
        const application=await this.db.Solicitud.findUnique({
           where:{id}
        })
        return application ? ApplicationResponseDto.toEntity(application) : null
    }

    async update(id: string, data: Partial<CreateApplicationDto>): Promise<Application> {
        const application = await this.db.Solicitud.update({
          where: { id: Number(id) },
          data: {
            nombreGrupo:data.groupName,
            roles:data.roles,
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
      const applications = await this.db.Solicitud.findMany();

      return ApplicationResponseDto.toEntities(applications);
  }

}