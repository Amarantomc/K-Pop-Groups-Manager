import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";

@injectable()
export class AddEvaluationUseCase {
  constructor(
    @inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository
  ) {}

  async execute(apprenticeId: number, agencyId: number, evaluation: number): Promise<void> {
    if (!apprenticeId || !agencyId || evaluation == null ) {
      throw new Error("Missing fields required");
    }

    await this.apprenticeRepository.addEvaluation(apprenticeId, agencyId, evaluation, new Date());
  }
}