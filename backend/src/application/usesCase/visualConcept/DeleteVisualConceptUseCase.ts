import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IVisualConceptRepository } from "../../interfaces/repositories/IVisualConcept";

@injectable()
export class DeleteVisualConceptUseCase {
  constructor(@inject(Types.IVisualConceptRepository) private VisualConceptRepository: IVisualConceptRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(visualConceptId: string): Promise<void> {
    const visualConcept = await this.VisualConceptRepository.findById(visualConceptId);

    if (!visualConcept) {
      throw new Error("Visual Concept not found");
    }

    await this.VisualConceptRepository.delete(visualConceptId);
  }
}