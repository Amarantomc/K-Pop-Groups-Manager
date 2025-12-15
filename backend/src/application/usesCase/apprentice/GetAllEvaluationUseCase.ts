import { ApprenticeEvaluationDto } from "../../dtos/apprentice/ApprenticeEvaluationDto";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class GetAllEvaluationUseCase {
  constructor(
    @inject(Types.IApprenticeRepository)
    private apprenticeRepository: IApprenticeRepository
  ) {}
  async execute(apprenticeId: number): Promise<ApprenticeEvaluationDto[]> {
    const evaluations = await this.apprenticeRepository.getAllEvaluations(apprenticeId);

    if (!evaluations || evaluations.length === 0) {
      return [];
    }

    return ApprenticeEvaluationDto.fromEntities(evaluations);
  }
}