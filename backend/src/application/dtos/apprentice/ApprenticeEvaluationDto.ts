import type { Prisma } from "@prisma/client";
import ApprenticeEvaluation from "../../../domain/entities/ApprenticeEvaluation";

export class ApprenticeEvaluationDto {
  constructor(
    public readonly apprenticeId: number,
    public readonly agencyId: number,
    public readonly evaluationDate: Date,
    public readonly score: number,
    public readonly apprentice?: { id: number; fullName: string; age: number } | null,
    public readonly agency?: { id: number; name: string; location: string } | null,
  ) {}

  static fromEntity(entity: ApprenticeEvaluation): ApprenticeEvaluationDto {
    return new ApprenticeEvaluationDto(
      entity.apprenticeId,
      entity.agencyId,
      entity.evaluationDate instanceof Date ? entity.evaluationDate : new Date(entity.evaluationDate),
      entity.score,
      entity.apprentice
        ? {
            id: entity.apprentice.id,
            fullName: entity.apprentice.fullName,
            age: entity.apprentice.age,
          }
        : null,
      entity.agency
        ? {
            id: entity.agency.id,
            name: entity.agency.name,
            location: entity.agency.location,
          }
        : null
    );
  }

  static toEntity(dto: ApprenticeEvaluationDto): ApprenticeEvaluation {
    return new ApprenticeEvaluation({
      apprenticeId: dto.apprenticeId,
      agencyId: dto.agencyId,
      evaluationDate: dto.evaluationDate,
      score: dto.score,
      apprentice: dto.apprentice ?? null,
      agency: dto.agency ?? null,
    });
  }

  static fromEntities(entities: ApprenticeEvaluation[]): ApprenticeEvaluationDto[] {
    return entities.map(e => this.fromEntity(e));
  }

  static toEntities(dtos: ApprenticeEvaluationDto[]): ApprenticeEvaluation[] {
    return dtos.map(d => this.toEntity(d));
  }
}