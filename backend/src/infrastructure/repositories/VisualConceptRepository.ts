
import { inject, injectable } from "inversify";
import type { CreateVisualConceptDto } from "../../application/dtos/visualConcept/CreateVisualConceptDto";
import { VisualConceptResponseDto } from "../../application/dtos/visualConcept/VisualConceptResponseDto";
import type { VisualConcept } from "../../domain";
import { Types } from "../di/Types";
import type { IVisualConceptRepository } from "../../application/interfaces/repositories/IVisualConcept";
import type { UnitOfWork } from "../PrismaUnitOfWork";


@injectable()
export class VisualConceptRepository implements IVisualConceptRepository {
  constructor(
    @inject(Types.PrismaClient) private prisma: any,
    @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
  ) {}

  private get db() {
    return this.unitOfWork.getTransaction();
  }

  async create(data: CreateVisualConceptDto): Promise<VisualConcept> {
    const visualConcept = await this.db.conceptoVisual.create({
      data: {
        imagen: data.picture,
      },
    });

    return VisualConceptResponseDto.toEntity(visualConcept);
  }

  async findById(id: any): Promise<VisualConcept | null> {
    const numericId = Number(id);

    const visualConcept = await this.db.conceptoVisual.findUnique({
      where: { id: numericId },
    });

    return visualConcept
      ? VisualConceptResponseDto.toEntity(visualConcept)
      : null;
  }

  async update(
    id: string,
    data: Partial<CreateVisualConceptDto>
  ): Promise<VisualConcept> {
    const visualConcept = await this.db.conceptoVisual.update({
      where: { id: Number(id) },
      data: {
        imagen: data.picture,
      },
    });

    return VisualConceptResponseDto.toEntity(visualConcept);
  }

  async delete(id: string): Promise<void> {
    const numericId = Number(id);
    const DEFAULT_CONCEPTO_VISUAL_ID = 1; // debe existir
  
    const grupos = await this.db.grupo.findMany({
      where: { idConceptoVisual: numericId },
      select: { id: true }
    });
  
    for (const grupo of grupos) {
      await this.db.grupo.update({
        where: { id: grupo.id },
        data: {
          idConceptoVisual: DEFAULT_CONCEPTO_VISUAL_ID
        }
      });
    }
  
    await this.db.conceptoVisual.delete({
      where: { id: numericId }
    });
  }

  async findAll(): Promise<VisualConcept[]> {
    const visualConcepts = await this.db.conceptoVisual.findMany();

    return visualConcepts.map((vc: any) =>
      VisualConceptResponseDto.toEntity(vc)
    );
  }
}