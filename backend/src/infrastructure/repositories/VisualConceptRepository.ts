import type { UnitOfWork } from "../PrismaUnitOfWork";
import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { IVisualConceptRepository } from "../../application/interfaces/repositories/IVisualConcept";
import type { CreateVisualConceptDto } from "../../application/dtos/visualConcept/CreateVisualConceptDto";
import { VisualConceptResponseDto } from "../../application/dtos/visualConcept/VisualConceptResponseDto";
import type { VisualConcept } from "../../domain";
 

@injectable()
export class VisualConceptRepository implements IVisualConceptRepository
{   
    constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}


     private get db() {
    return this.unitOfWork.getTransaction();
  }
    
   async create(data: CreateVisualConceptDto): Promise<VisualConcept> {
         
        
        const visualConcept= await this.db.ConceptoVisual.create({
            data:{
                descripcion: data.picture,
            }
        })
        
        
        return VisualConceptResponseDto.toEntity(visualConcept)
    }
    async findById(id: any): Promise<VisualConcept | null> {
         id=(Number)(id)
        const visualConcept=await this.db.ConceptoVisual.findUnique({
           where:{id}
        })
        return visualConcept ? VisualConceptResponseDto.toEntity(visualConcept) : null
    }

    async update(id: string, data: Partial<CreateVisualConceptDto>): Promise<VisualConcept> {
        const VisualConcept = await this.db.ConceptoVisual.update({
          where: { id: Number(id) },
          data: {
            nombre:data.picture,
          },
        });
      
        return VisualConceptResponseDto.toEntity(VisualConcept);
      }
   async delete(id: string): Promise<void> {
    try {
      await this.db.ConceptoVisual.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new Error(`Error deleting Visual Concept with id ${id}: ${error}`);
    }
  }

    async findAll(): Promise<VisualConcept[]> {
      const visualConcepts = await this.db.ConceptoVisual.findMany();

      return visualConcepts
  }
}