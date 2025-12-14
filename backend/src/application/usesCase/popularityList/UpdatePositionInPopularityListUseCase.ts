import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";
import { PopularityListResponseDto } from "../../dtos/popularityList/PopularityListResponseDto";

@injectable()
export class UpdatePositionInPopularityListUseCase {
  constructor(
    @inject(Types.IPopularityListRepository)
    private popularityListRepository: IPopularityListRepository
  ) {}

  async execute(command: {
    popularityListId: number;
    songId: number;
    newPosition: number;
  }): Promise<PopularityListResponseDto> {

    const updatedList =
      await this.popularityListRepository.updatePositionInPopularityList(
        command.popularityListId,
        command.songId,
        command.newPosition
      );

    return PopularityListResponseDto.fromEntity(updatedList);
  }
}