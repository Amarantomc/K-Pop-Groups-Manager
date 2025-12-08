import { Concept } from "../../../domain/entities/Concept";


export class ConceptResponseDto{
    constructor(
        public readonly id:number,
        public readonly name:string,
        public readonly description:string
    ){}

    static fromEntity(concept: any): ConceptResponseDto {
        return new ConceptResponseDto(
            concept.id,
            concept.name,
            concept.description
        );
      }

      static toEntity(concept: any): Concept {
        
        return new Concept(
            {
                id: concept.id,
                description: concept.descripcion,
                name: concept.nombre,
            }
        );
      }

      static fromEntities(concepts: any[]): ConceptResponseDto[] {
        return concepts.map(concept => this.fromEntity(concept));
      }

       static toEntities(concepts: any[]): Concept[] {
        return concepts.map(concept => this.toEntity(concept));
      }
}
