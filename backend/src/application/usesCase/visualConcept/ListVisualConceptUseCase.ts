import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IVisualConceptRepository } from "../../interfaces/repositories/IVisualConcept";
import { VisualConceptResponseDto } from "../../dtos/visualConcept/VisualConceptResponseDto";

@injectable()
export class ListVisualConceptUseCase {
	constructor(@inject(Types.IVisualConceptRepository) private VisualConceptRepository: IVisualConceptRepository) {}

	async execute(): Promise<VisualConceptResponseDto[]> {
		const list = await this.VisualConceptRepository.findAll();
		return VisualConceptResponseDto.fromEntities(list)
	}
}