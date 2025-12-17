import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";

@injectable()
export class GetApprenticesWhithoutApplicationUseCase {
  constructor(
    @inject(Types.IApplicationRepository)
    private readonly applicationRepository: IApplicationRepository
  ) {}

  async execute(): Promise<ApprenticeResponseDto[]> {

    const apprentices = await this.applicationRepository.getApprenticesWhithoutApplication();

    return ApprenticeResponseDto.fromEntities(apprentices);
  }
}