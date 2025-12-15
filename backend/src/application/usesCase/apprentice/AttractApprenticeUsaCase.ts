import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class AttractApprenticesUseCase {
  constructor(
    @inject(Types.IApprenticeRepository)
    private apprenticeRepository: IApprenticeRepository
  ) {}

  async execute(apprenticeId: number, agencyId: number): Promise<void> {
    if (!apprenticeId || !agencyId) {
      throw new Error("ApprenticeId and AgencyId are required");
    }

    await this.apprenticeRepository.attractApprentice(apprenticeId,agencyId);

    
  }
}