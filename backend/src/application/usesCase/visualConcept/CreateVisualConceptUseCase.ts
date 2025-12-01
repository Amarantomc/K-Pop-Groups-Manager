import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IVisualConceptRepository } from "../../interfaces/repositories/IVisualConcept";
import { VisualConceptResponseDto } from "../../dtos/visualConcept/VisualConceptResponseDto";
import type { CreateVisualConceptDto } from "../../dtos/visualConcept/CreateVisualConceptDto";


@injectable()
export class CreateVisualConceptUseCase{

    constructor(
    @inject(Types.IVisualConceptRepository) private VisualConceptRepository: IVisualConceptRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreateVisualConceptDto):Promise<VisualConceptResponseDto>{
        try
        {
            await this.unitOfWork.beginTransaction();
            const visualConcept = await this.VisualConceptRepository.create(command);
            await this.unitOfWork.commit();
            
            return new VisualConceptResponseDto(
                visualConcept.id,
                visualConcept.picture,
            );
        }
        catch(error){
            await this.unitOfWork.rollback();
            throw error;
        }
      }
}