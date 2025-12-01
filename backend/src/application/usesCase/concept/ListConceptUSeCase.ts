import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IConceptRepository } from "../../interfaces/repositories/IConceptRepository";
import { ConceptResponseDto } from "../../dtos/concept/ConceptResponseDto";

@injectable()
export class ListConceptUseCase {
	constructor(@inject(Types.IConceptRepository) private conceptRepository: IConceptRepository) {}

	async execute(): Promise<ConceptResponseDto[]> {
		
	try {
		const list = await this.conceptRepository.findAll();
		return ConceptResponseDto.fromEntities(list)
		} catch (error) {
			throw error
		}

	}
}