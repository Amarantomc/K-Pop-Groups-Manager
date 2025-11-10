import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";
import type { CreateApprenticeDto } from "../../dtos/apprentice/CreateApprenticeDto";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class UpdateApprenticeUseCase {
  constructor(@inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository) {}

  async execute(
    apprenticeId: string,
    data: Partial<CreateApprenticeDto>
  ): Promise<ApprenticeResponseDto> {

    const apprentice = await this.apprenticeRepository.findById(apprenticeId);

    if (!apprentice) {
      throw new Error("Apprentice not found");
    }

    const updatedApprentice = await this.apprenticeRepository.update(apprenticeId, data);

    return new ApprenticeResponseDto(
      updatedApprentice.id,
      updatedApprentice.name,
      updatedApprentice.dateOfBirth,
      updatedApprentice.age,
      updatedApprentice.trainingLv,
      updatedApprentice.status
    );
  }
}