import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { CreateAwardDto } from "../../dtos/award/CreateAwardDto";
import type { IAwardRepository } from "../../interfaces/repositories/IAwardRepository";
import { AwardResponseDto } from "../../dtos/award/AwardResposeDto";

@injectable()
export class UpdateAwardUseCase {
  constructor(@inject(Types.IAwardRepository) private awardRepository: IAwardRepository) {}

  async execute(
    AwardId: string,
    data: Partial<CreateAwardDto>
  ): Promise<AwardResponseDto> {

    const award = await this.awardRepository.findById(AwardId);

    if (!award) {
      throw new Error("Award not found");
    }

    const updatedAward = await this.awardRepository.update(AwardId, data);

    return new AwardResponseDto(
      updatedAward.id,
      updatedAward.awardTitle,
      updatedAward.academyName,
      updatedAward.albums
    );
  }
}