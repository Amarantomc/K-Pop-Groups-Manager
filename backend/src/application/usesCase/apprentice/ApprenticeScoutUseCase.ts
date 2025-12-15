import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { UnitOfWork } from "../../../infrastructure/PrismaUnitOfWork";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";

@injectable()
export class ApprenticeScoutUseCase {
  constructor(
    @inject(Types.IApprenticeRepository)
    private readonly apprenticeRepository: IApprenticeRepository,
    @inject(Types.IUnitOfWork)
    private readonly unitOfWork: UnitOfWork
  ) {}

  async execute(): Promise<ApprenticeResponseDto[]> {
    try {
      await this.unitOfWork.beginTransaction();

      const apprentices = await this.apprenticeRepository.apprenticeScout();

      await this.unitOfWork.commit();

      return ApprenticeResponseDto.fromEntities(apprentices);
    } catch (error) {
        console.log(error);
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}