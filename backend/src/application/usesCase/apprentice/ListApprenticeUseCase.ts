import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";

@injectable()
export class ListApprenticeUseCase {
	constructor(@inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository) {}

	async execute(): Promise<ApprenticeResponseDto[]> {
		const list = await this.apprenticeRepository.findAll();
		return ApprenticeResponseDto.fromEntities(list)
	}
}