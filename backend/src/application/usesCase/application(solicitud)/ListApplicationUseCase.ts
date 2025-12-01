import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import { ApplicationResponseDto } from "../../dtos/application(solicitud)/ApplicationResponseDto";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";

@injectable()
export class ListApplicationUseCase {
	constructor(@inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository) {}

	async execute(): Promise<ApplicationResponseDto[]> {
		const list = await this.applicationRepository.findAll();
		return ApplicationResponseDto.fromEntities(list)
	}
}