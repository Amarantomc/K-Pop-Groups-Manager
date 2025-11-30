import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";
import { PopularityListResponseDto } from "../../dtos/popularityList/PopularityListResponseDto";

@injectable()
export class ListPopularityListUseCase {
	constructor(@inject(Types.IPopularityListRepository) private popularityListRepository: IPopularityListRepository) {}

	async execute(): Promise<PopularityListResponseDto[]> {
		const list = await this.popularityListRepository.findAll();
		return PopularityListResponseDto.fromEntities(list)
	}
}