import type { Agency } from "../../../domain/entities/Agency";
import { Group } from "../../../domain/entities/Group";

import { AgencyResponseDTO } from "../agency/AgencyResponseDTO";
import { ConceptResponseDto } from "../concept/ConceptResponseDto";
import { VisualConceptResponseDto } from "../visualConcept/VisualConceptResponseDto";


export class GroupResponseDTO {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly debut: Date,
    public readonly status: string,
    public readonly memberCount: number,

    public readonly agency?: AgencyResponseDTO | null,
    public readonly concept?: ConceptResponseDto,
    public readonly visualConcept?: VisualConceptResponseDto,

    public readonly members?: Array<{
      apprenticeId: number;
      groupId: number;
      realName: string;
      artisticName: string;
    }>,

    public readonly albums?: any[],
    public readonly activities?: any[]
  ) {}


  static fromEntity(group: Group): GroupResponseDTO {
    return new GroupResponseDTO(
      group.id,
      group.name,
      group.debut,
      group.status,
      group.memberCount,

      group.agency
        ? AgencyResponseDTO.fromEntity(group.agency)
        : null,

      group.concept
        ? ConceptResponseDto.fromEntity(group.concept)
        : undefined,

      group.visualConcept
        ? VisualConceptResponseDto.fromEntity(group.visualConcept)
        : undefined,

      group.members ?? [],
      group.albums ?? [],
      group.activities ?? []
    );
  }

  static fromEntities(groups: Group[]): GroupResponseDTO[] {
    return groups.map(group => this.fromEntity(group));
  }


  static toEntity(group: any): Group {
    return new Group({
      id: group.id,
      name: group.nombreCompleto ?? group.name,
      debut: group.fechaDebut ?? group.debut,
      status: group.estadoGrupo ?? group.status,
      memberCount: group.Nomiembros ?? group.memberCount,

      agency: group.agency ?? null,
      concept: group.concept ?? null,
      visualConcept: group.visualConcept ?? null,

      members: group.members ?? [],
      albums: group.albums ?? [],
      activities: group.activities ?? []
    });
  }

  static toEntities(groups: any[]): Group[] {
    return groups.map(group => this.toEntity(group));
  }


  static toEntitySimple(group: any, agency?: Agency): Group {
    return new Group({
      id: group.id,
      name: group.nombreCompleto,
      debut: group.fechaDebut,
      status: group.estadoGrupo,
      memberCount: group.Nomiembros,
      agency
    });
  }

  static toEntitiesSimple(groups: any[], agency?: Agency): Group[] {
    return groups.map(g =>
      this.toEntitySimple(g.grupo ?? g, agency)
    );
  }
}