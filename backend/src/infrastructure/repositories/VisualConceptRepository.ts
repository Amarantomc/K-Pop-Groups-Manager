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
                imagen: data.picture,
            }
        })
        
        
        return VisualConceptResponseDto.toEntity(visualConcept)
    }

    async findById(id: any): Promise<VisualConcept | null> {
        const numericId = Number(id);
        const visualConcept = await this.db.ConceptoVisual.findUnique({
            where: { idConcepto: numericId } // ✅ nombre correcto
        });
        return visualConcept ? VisualConceptResponseDto.toEntity(visualConcept) : null;
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
          // Borrar primero los ConceptoVisual relacionados
          await this.db.ConceptoVisual.deleteMany({
            where: { idConcepto: Number(id) }
          });
      
          // Luego borrar el Concepto
          await this.db.Concepto.delete({
            where: { id }
          });

          //actualizar en la tabla grupo-concepto el nuevo id de concepto *momentaneo
          await this.db.grupo.update({
            where:{ id: Number(id) },
            data: {
              idConcepto: -1
            }
            
          });

        } catch (error) {
          console.error(`Error deleting concept with id ${id}:`, error);
          throw error;
        }
      }

    async findAll(): Promise<VisualConcept[]> {
      const visualConcepts = await this.db.ConceptoVisual.findMany();

      return visualConcepts
  }
}