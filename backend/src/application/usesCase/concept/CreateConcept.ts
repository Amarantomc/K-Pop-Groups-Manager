import type { Concept } from "../../../domain";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IConceptRepository } from "../../interfaces/repositories/IConceptRepository";
import type { CreateConceptDto } from "../../dtos/concept/CreateConceptDto";
import { ConceptResponseDto } from "../../dtos/concept/ConceptResponseDto";


@injectable()
export class CreateConceptUseCase{

    constructor(
    @inject(Types.IConceptRepository) private conceptRepository: IConceptRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreateConceptDto):Promise<ConceptResponseDto>{
        try
        {
            await this.unitOfWork.beginTransaction();
            const concept = await this.conceptRepository.create(command);
            await this.unitOfWork.commit();
            
            return new ConceptResponseDto(
                concept.id,
                concept.name,
                concept.description,
            );
        }
        catch(error){
            await this.unitOfWork.rollback();
            throw error;
        }
      }
}