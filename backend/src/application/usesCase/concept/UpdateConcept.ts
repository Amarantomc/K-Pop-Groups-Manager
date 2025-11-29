import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { CreateConceptDto } from "../../dtos/concept/CreateConceptDto";
import { ConceptResponseDto } from "../../dtos/concept/ConceptResponseDto";
import type { IConceptRepository } from "../../interfaces/repositories/IConceptRepository";

@injectable()
export class UpdateConceptUseCase {
  constructor(@inject(Types.IConceptRepository) private conceptRepository: IConceptRepository) {}

  async execute(
    conceptId: string,
    data: Partial<CreateConceptDto>
  ): Promise<ConceptResponseDto> {

    const concept = await this.conceptRepository.findById(conceptId);

    if (!concept) {
      throw new Error("Concept not found");
    }

    const updatedConcept = await this.conceptRepository.update(conceptId, data);

    return new ConceptResponseDto(
      updatedConcept.id,
      updatedConcept.name,
      updatedConcept.description
    );
  }
}