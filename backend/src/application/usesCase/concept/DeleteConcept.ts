import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IConceptRepository } from "../../interfaces/repositories/IConceptRepository";

@injectable()
export class DeleteConceptUseCase {
  constructor(@inject(Types.IConceptRepository) private conceptRepository: IConceptRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(conceptId: string): Promise<void> {
    const concept = await this.conceptRepository.findById(conceptId);

    if (!concept) {
      throw new Error("Concept not found");
    }

    await this.conceptRepository.delete(conceptId);
  }
}