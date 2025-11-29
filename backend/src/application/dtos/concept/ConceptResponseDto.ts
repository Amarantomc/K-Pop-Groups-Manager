import {Concept } from "../../../domain";

export class ConceptResponseDto{
    constructor(
        public readonly id:number,
        public readonly name:string,
        public readonly description:string
    ){}

    static fromEntity(concept: any): ConceptResponseDto {
        return new ConceptResponseDto(
            concept.id,
            concept.nombre,
            concept.descripcion
        );
      }

      static toEntity(concept: any): Concept {
        return new Concept(
            {
                id: concept.id,
                name: concept.nombre,
                description: concept.descripcion,
            }
        );
      }

      static fromEntities(concepts: any[]): ConceptResponseDto[] {
        return concepts.map(concept => this.fromEntity(concept));
      }
}
