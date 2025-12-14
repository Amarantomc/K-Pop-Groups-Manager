import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";

@injectable()
export class AddEvaluationUseCase {
  constructor(
    @inject(Types.IArtistRepository) private artistRepository: IApprenticeRepository
  ) {}

  async execute(apprenticeId: number, agencyId: number, evaluation: number,date: Date): Promise<void> {
    if (!apprenticeId || !agencyId || evaluation == null || !date) {
      throw new Error("Missing fields required");
    }

    await this.artistRepository.addEvaluation(apprenticeId, agencyId, evaluation, date);
  }
}