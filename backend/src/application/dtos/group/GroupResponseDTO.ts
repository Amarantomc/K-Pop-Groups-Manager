import type { Agency } from "../../../domain/entities/Agency";
import { Group } from "../../../domain/entities/Group";
import { ActivityResponseDto } from "../activity/ActivityResponseDto";

import { AgencyResponseDTO } from "../agency/AgencyResponseDTO";
import { AlbumResponseDto } from "../album/AlbumResponseDto";
import { ConceptResponseDto } from "../concept/ConceptResponseDto";
import { VisualConceptResponseDto } from "../visualConcept/VisualConceptResponseDto";


export class GroupResponseDTO {
  constructor(
    public readonly id?: number,
    public readonly name?: string,
    public readonly debut?: Date,
    public readonly status?: string,
    public readonly memberCount?: number,

    public readonly agency?: AgencyResponseDTO | null,
    public readonly concept?: ConceptResponseDto,
    public readonly visualConcept?: VisualConceptResponseDto,

    public readonly members?: Array<{
      apprenticeId: number;
      groupId: number;
      realName: string;
      artisticName: string;
    }>,

    public readonly albums?: AlbumResponseDto[],
    public readonly activities?: ActivityResponseDto[] 
  ) {}


  // static fromEntity(group: Group): GroupResponseDTO {
  //   return new GroupResponseDTO(
  //     group.id,
  //     group.name,
  //     group.debut,
  //     group.status,
  //     group.memberCount,
  
  //     group.agency
  //       ? AgencyResponseDTO.fromEntity(group.agency)
  //       : null,
  
  //     group.concept
  //       ? ConceptResponseDto.fromEntity(group.concept)
  //       : undefined,
  
  //     group.visualConcept
  //       ? VisualConceptResponseDto.fromEntity(group.visualConcept)
  //       : undefined,
  
  //     group.members ?? [],
  //     group.albums ?? [],
  //     group.activities
  //     ? group.activities.map(a => ActivityResponseDto.fromEntity(ActivityResponseDto.toEntity(a)))
  //     : [],


  //   );
  // }

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
  
      group.albums
        ? group.albums.map(a => AlbumResponseDto.fromEntity(a))
        : [],
  
      // group.activities
      //   ? group.activities.map(a => ActivityResponseDto.fromEntity(a))
      //   : []
    );
  }

  static fromEntities(groups: Group[]): GroupResponseDTO[] {
    return groups.map(group => this.fromEntity(group));
  }


  // static toEntity(group: any): Group {
  //   return new Group({
  //     id: group.id,
  //     name: group.nombreCompleto,
  //     debut: group.fechaDebut,
  //     status: group.estadoGrupo,
  //     memberCount: group.Nomiembros,
  
  //     // AGENCIA (tomamos la primera)
  //     agency: group.Agencias?.length
  //       ? AgencyResponseDTO.toEntity(group.Agencias[0])
  //       : undefined,
  
  //     // CONCEPTOS
  //     concept: group.concepto ?? null,
  //     visualConcept: group.conceptoVisual ?? null,
      
  //     // MIEMBROS
  //     members: group.HistorialArtistas
  //     ?.filter((h: any) => h.fechaFinalizacion === null)
  //     .map((h: any) => ({
  //        apprenticeId: h.idAp,
  //        groupId: h.idGr,
  //        realName: h.artista?.aprendiz?.nombreCompleto ?? "",
  //        artisticName: h.artista?.nombreArtistico ?? "",
  //        rol: h.rol,
  //     })) ?? [],

  //     //ALBUMS
  //     albums: group.Lanzamiento
  //     ?.map((la: any) => la.album)
  //     ?? [],

  //     //ACTIVITIES
  //     activities: group.Actividades
  //     ?.map((pa: any) => pa.actividad)
  //     ?? [],

  //   })
  // }

  static toEntity(group: any): Group {
    return new Group({
      id: group.id,
      name: group.nombreCompleto,
      debut: group.fechaDebut,
      status: group.estadoGrupo,
      memberCount: group.Nomiembros,
  
      agency: group.Agencias?.length
        ? AgencyResponseDTO.toEntity(group.Agencias[0])
        : undefined,
  
      concept: group.concepto ?? null,
      visualConcept: group.conceptoVisual ?? null,
  
      members: group.HistorialArtistas
        ?.filter((h: any) => h.fechaFinalizacion === null)
        .map((h: any) => ({
          apprenticeId: h.idAp,
          groupId: h.idGr,
          realName: h.artista?.aprendiz?.nombreCompleto ?? "",
          artisticName: h.artista?.nombreArtistico ?? "",
          rol: h.rol,
        })) ?? [],
  
      albums: group.Lanzamiento
        ?.map((l: any) => l.album ? AlbumResponseDto.toEntity(l.album) : null)
        .filter(Boolean) ?? [],
  
      activities: group.Actividades
        ?.map((pa: any) => pa.actividad)
        ?? [],
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