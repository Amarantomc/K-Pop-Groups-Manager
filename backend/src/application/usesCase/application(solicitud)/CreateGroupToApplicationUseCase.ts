import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import type { Group } from "../../../domain/entities/Group";
import { ApplicationCreateGroupDTO } from "../../dtos/application(solicitud)/ApplicationCreateGroupDTO";

@injectable()
export class CreateGroupToApplicationUseCase {
  constructor(
    @inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository
  ) {}

  async execute(applicationId: string): Promise<Group> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new Error("Application not found");

    console.log(app);
    // Construir DTO
    const dto = ApplicationCreateGroupDTO.fromApplication(app);

    // Crear grupo desde la solicitud
    const group = await this.applicationRepository.createFromApplication(dto, Number(applicationId));

    return group;
  }
}