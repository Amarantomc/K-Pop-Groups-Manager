import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IConceptRepository } from "../../interfaces/repositories/IConceptRepository";
import { ConceptResponseDto } from "../../dtos/concept/ConceptResponseDto";

@injectable()
export class GetConceptUseCase{
    constructor(@inject(Types.IConceptRepository) private conceptRepository: IConceptRepository){}

    async excute(conceptId:string): Promise<ConceptResponseDto> {

        try {
                const concept = await this.conceptRepository.findById(conceptId);
            if(!concept)
            {
                throw new Error('Concept not found');
            }

            return new ConceptResponseDto(concept.id, concept.name, concept.description);
        } catch (error) {
            throw error
        }    
        

    }
}