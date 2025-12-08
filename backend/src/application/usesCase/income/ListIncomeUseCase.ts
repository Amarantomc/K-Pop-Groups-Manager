import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IIncomeRepository } from "../../interfaces/repositories/IIncomeRepository";
import { IncomeResponseDto } from "../../dtos/income/IncomeResponseDto";

@injectable()
export class ListIncomeUseCase {
	constructor(@inject(Types.IIncomeRepository) private incomeRepository: IIncomeRepository) {}

	async execute(): Promise<IncomeResponseDto[]> {
		const list = await this.incomeRepository.findAll();
		return IncomeResponseDto.fromEntities(list)
	}
}