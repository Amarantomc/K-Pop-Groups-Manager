import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { CreateVisualConceptDto } from "../../dtos/visualConcept/CreateVisualConceptDto";
import { VisualConceptResponseDto } from "../../dtos/visualConcept/VisualConceptResponseDto";
import type { IVisualConceptRepository } from "../../interfaces/repositories/IVisualConcept";

@injectable()
export class UpdateVisualConceptUseCase {
  constructor(@inject(Types.IVisualConceptRepository) private VisualConceptRepository: IVisualConceptRepository) {}

  async execute(
    VisualConceptId: string,
    data: Partial<CreateVisualConceptDto>
  ): Promise<VisualConceptResponseDto> {

    const visualConcept = await this.VisualConceptRepository.findById(VisualConceptId);

    if (!visualConcept) {
      throw new Error("Visual Concept not found");
    }

    const updatedVisualConcept = await this.VisualConceptRepository.update(VisualConceptId, data);

    return new VisualConceptResponseDto(
      updatedVisualConcept.id,
      updatedVisualConcept.picture
    );
  }
}