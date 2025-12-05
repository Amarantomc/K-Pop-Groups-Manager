import type { UnitOfWork } from "../PrismaUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { CreateConceptDto } from "../../application/dtos/concept/CreateConceptDto";
import type { Concept } from "../../domain";
import type { IConceptRepository } from "../../application/interfaces/repositories/IConceptRepository";
import { ConceptResponseDto } from "../../application/dtos/concept/ConceptResponseDto";
 

@injectable()
export class ConceptRepository implements IConceptRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}


     private get db() {
    return this.unitOfWork.getTransaction();
  }
    
   async create(data: CreateConceptDto): Promise<Concept> {
         
        
        const concept= await this.db.Concepto.create({
            data:{
                descripcion: data.description,
                nombre: data.name
            }
        })
        
        
        return ConceptResponseDto.toEntity(concept)
    }
    async findById(id: any): Promise<Concept | null> {
         id=(Number)(id)
        const concept=await this.db.Concepto.findUnique({
           where:{id}
        })
        return concept ? ConceptResponseDto.toEntity(concept) : null
    }

    async update(id: string, data: Partial<CreateConceptDto>): Promise<Concept> {
        const concept = await this.db.Concepto.update({
          where: { id: Number(id) },
          data: {
            nombre:data.name,
            descripcion:data.description,
          },
        });
      
        return ConceptResponseDto.toEntity(concept);
      }
   async delete(id: string): Promise<void> {
     
      await this.db.Concepto.delete({
        where: { id: Number(id) },
      });
     
  }

    async findAll(): Promise<Concept[]> {
      const concepts = await this.db.Concepto.findMany();
      
      return ConceptResponseDto.toEntities(concepts)
  }
}