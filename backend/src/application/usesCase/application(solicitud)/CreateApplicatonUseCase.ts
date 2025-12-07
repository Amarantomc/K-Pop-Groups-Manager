import type { Application } from "../../../domain";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { CreateApplicationDto } from "../../dtos/application(solicitud)/CreateApplicationDto";
import { ApplicationResponseDto } from "../../dtos/application(solicitud)/ApplicationResponseDto";


@injectable()
export class CreateApplicationUseCase{

    constructor(
    @inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreateApplicationDto):Promise<ApplicationResponseDto>{
        try
        {
         
            await this.unitOfWork.beginTransaction();
            const application = await this.applicationRepository.create(command);
            //console.log("zzz");
            await this.unitOfWork.commit();
            
            return new ApplicationResponseDto(
                application.id,
                application.groupName,
                application.date,
                application.idConcept,
                application.roles,
                application.idAgency,
                application.apprentices,
                application.artists
            );
        }
        catch(error){
            //console.log(error);
            await this.unitOfWork.rollback();
            throw error;
        }
      }
}