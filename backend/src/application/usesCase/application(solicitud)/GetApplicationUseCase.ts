import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { Application } from "../../../domain";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import { ApplicationResponseDto } from "../../dtos/application(solicitud)/ApplicationResponseDto";

@injectable()
export class GetApplicationUseCase{
    constructor(@inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository){}

    async excute(applicationId:string): Promise<ApplicationResponseDto> {

            const application = await this.applicationRepository.findById(applicationId);
            if(!application)
            {
                throw new Error('Application not found');
            }

            return new ApplicationResponseDto(application.id, application.groupName,application.date,application.idConcept,application.roles,application.idAgency,application.apprentices,application.artists,application.status);
    }
}