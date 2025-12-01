import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IVisualConceptRepository } from "../../interfaces/repositories/IVisualConcept";
import { VisualConceptResponseDto } from "../../dtos/visualConcept/VisualConceptResponseDto";

@injectable()
export class GetVisualConceptUseCase{
    constructor(@inject(Types.IVisualConceptRepository) private VisualConceptRepository: IVisualConceptRepository){}

    async excute(VisualConceptId:string): Promise<VisualConceptResponseDto> {

            const VisualConcept = await this.VisualConceptRepository.findById(VisualConceptId);
            if(!VisualConcept)
            {
                throw new Error('Visual Concept not found');
            }

            return new VisualConceptResponseDto(VisualConcept.id, VisualConcept.picture);
    }
}