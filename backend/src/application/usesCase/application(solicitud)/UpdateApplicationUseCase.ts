import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import type { CreateApplicationDto } from "../../dtos/application(solicitud)/CreateApplicationDto";
import { ApplicationResponseDto } from "../../dtos/application(solicitud)/ApplicationResponseDto";
import type { UpdateApplicationDto } from "../../dtos/application(solicitud)/UpdateApplicationDto";

@injectable()
export class UpdateApplicationUseCase {
  constructor(@inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository) {}

  async execute(
    applicationId: string,
    data: Partial<CreateApplicationDto>
  ): Promise<ApplicationResponseDto> {

    const application = await this.applicationRepository.findById(applicationId);

    if (!application) {
      throw new Error("Application not found");
    }

    const updatedApplication = await this.applicationRepository.update(applicationId, data);

    return new ApplicationResponseDto(
      updatedApplication.id,
      updatedApplication.groupName,
      updatedApplication.date,
      updatedApplication.idConcept,
      updatedApplication.roles,
      updatedApplication.idAgency
    );
  }
}