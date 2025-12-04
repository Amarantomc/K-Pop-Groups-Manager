import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IConceptRepository } from "../../interfaces/repositories/IConceptRepository";

@injectable()
export class DeleteConceptUseCase {
  constructor(@inject(Types.IConceptRepository) private conceptRepository: IConceptRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(conceptId: string): Promise<void> {
    
    try {
          this.unitOfWork.beginTransaction()
          const concept = await this.conceptRepository.findById(conceptId);

    if (!concept) {
      throw new Error("Concept not found");
    }
    await this.conceptRepository.delete(conceptId);
    this.unitOfWork.commit()
    } catch (error) {
       this.unitOfWork.rollback()
       throw error
    }

  }
}