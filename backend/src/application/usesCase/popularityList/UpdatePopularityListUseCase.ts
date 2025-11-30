import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { CreatePopularityListDto } from "../../dtos/popularityList/CreatepopularityListDto";
import { PopularityListResponseDto } from "../../dtos/popularityList/PopularityListResponseDto";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";

@injectable()
export class UpdatePopularityListUseCase {
  constructor(@inject(Types.IPopularityListRepository) private popularityListRepository: IPopularityListRepository) {}

  async execute(
    popularityListId: string,
    data: Partial<CreatePopularityListDto>
  ): Promise<PopularityListResponseDto> {

    const popularityList = await this.popularityListRepository.findById(popularityListId);

    if (!popularityList) {
      throw new Error("Popularity List not found");
    }

    const updatedPopularityList = await this.popularityListRepository.update(popularityListId, data);

    return new PopularityListResponseDto(
      updatedPopularityList.id,
      updatedPopularityList.name,
      updatedPopularityList.listType,
      updatedPopularityList.songs,
    );
  }
}