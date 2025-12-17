import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";

@injectable()
export class ApprenticeDecisionByApplicationUseCase {
  constructor(
    @inject(Types.IApplicationRepository)
    private readonly applicationRepository: IApplicationRepository
  ) {}

  async execute(applicationId: number,apprenticeId: number,decision: boolean): Promise<void> {

    if (applicationId === undefined || apprenticeId === undefined || decision === undefined) {
      throw new Error("applicationId, apprenticeId and decision are required");
    }

    await this.applicationRepository.apprenticeDecisionByApplication(applicationId,apprenticeId,decision);
    
    }
}