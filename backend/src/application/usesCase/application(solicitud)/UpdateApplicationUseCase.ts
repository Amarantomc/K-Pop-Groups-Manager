import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import type { CreateApplicationDto } from "../../dtos/application(solicitud)/CreateApplicationDto";
import { ApplicationResponseDto } from "../../dtos/application(solicitud)/ApplicationResponseDto";

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
      updatedApplication.description,
      typeof updatedApplication.date === "string" ? new Date(updatedApplication.date) : updatedApplication.date,
      //updatedApplication.apprentices,
      //updatedApplication.artists
    );
  }
}