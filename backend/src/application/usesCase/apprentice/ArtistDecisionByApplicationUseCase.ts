import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";

@injectable()
export class ArtistDecisionByApplicationUseCase {
  constructor(
    @inject(Types.IApplicationRepository)
    private readonly applicationRepository: IApplicationRepository
  ) {}

  async execute(applicationId: number,apprenticeId: number,groupId: number,decision: boolean): Promise<void> {

    if (applicationId === undefined ||apprenticeId === undefined ||groupId === undefined || decision === undefined) 
    {
      throw new Error("applicationId, apprenticeId, groupId and decision are required");
    }

    await this.applicationRepository.artistDecisionByApplication(applicationId, apprenticeId,groupId,decision);
  }
}