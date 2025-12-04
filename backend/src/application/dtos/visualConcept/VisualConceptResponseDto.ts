import {VisualConcept } from "../../../domain";

export class VisualConceptResponseDto{
    constructor(
        public readonly id:number,
        public readonly picture:string,
    ){}

    static fromEntity(visualConcept: any): VisualConceptResponseDto {
        return new VisualConceptResponseDto(
            visualConcept.id,
            visualConcept.picture,
        );
      }

      static toEntity(visualConcept: any): VisualConcept {
        return new VisualConcept(
            {
                id: visualConcept.id,
                picture: visualConcept.imagen,
            }
        );
      }

      static fromEntities(VisualConcepts: any[]): VisualConceptResponseDto[] {
        return VisualConcepts.map(VisualConcept => this.fromEntity(VisualConcept));
      }
}
