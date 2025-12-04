import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAwardRepository } from "../../interfaces/repositories/IAwardRepository";
import { AwardResponseDto } from "../../dtos/award/AwardResposeDto";

@injectable()
export class ListAwardUseCase {
	constructor(@inject(Types.IAwardRepository) private awardRepository: IAwardRepository) {}

	async execute(): Promise<AwardResponseDto[]> {
		const list = await this.awardRepository.findAll();
		return AwardResponseDto.fromEntities(list)
	}
}