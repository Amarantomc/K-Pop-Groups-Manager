import type { Agency } from "../../../domain/entities/Agency";
import { Group } from "../../../domain/entities/Group";
import { AgencyResponseDTO } from "../agency/AgencyResponseDTO";
import { ArtistResponseDto } from "../artist/ArtistResponseDto";
import { ConceptResponseDto } from "../concept/ConceptResponseDto";
import { VisualConceptResponseDto } from "../visualConcept/VisualConceptResponseDto";

export class GroupResponseDTO {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly debut: Date,
		public readonly status: string,
		public readonly memberCount: number,
		public readonly IdAgency: number,
		public readonly IdConcept?: number,
		public readonly IdVisualConcept?: number,
		public readonly members?: Array<{apprenticeId:number,
			groupId:number
		}>,
		public readonly albums?: number[],
		public readonly activities?: number[]
	) {}

	static fromEntity(group: Group): GroupResponseDTO {
		
		return new GroupResponseDTO(
			group.id,
			group.name,
			group.debut,
			group.status,
			group.memberCount,
			
			group.agency.id,
			group.concept?.id,
			group.visualConcept?.id, // Cambiar por: group.visualConcept.id
			
			group.members?.map(member=>({apprenticeId:member.ApprenticeId,groupId:member.GroupId})),
			group.albums?.map(album=>album.id),
			group.activities?.map(activity=>activity.id)
		);
	}

	static toEntity(group: any): Group {
		
		const agency=AgencyResponseDTO.toEntity(group.Agencia || group.Agencias?.[0] || null);
		const concept=ConceptResponseDto.toEntity(group.concepto);
		const visualConcept=VisualConceptResponseDto.toEntity(group.conceptoVisual);
		const members =ArtistResponseDto.toEntities(group.HistorialArtistas)
		return new Group({
			id: group.id,
			name: group.nombreCompleto || group.name,
			debut: group.fechaDebut || group.debut,
			memberCount: group.Nomiembros || group.memberCount,
			status: group.estadoGrupo || group.status,
			agency: agency,
			concept:concept,
			visualConcept:visualConcept,
			members:members,
			//album activity

				
			
		});
	}

	static fromEntities(groups: any[]): GroupResponseDTO[] {
		return groups.map((group) => this.fromEntity(group));
	}

	 static toEntitySimple(group:any,agency:Agency):Group{
		 
		return new Group({
		  id:group.id,
		  name:group.nombreCompleto,
		  debut:group.fechaDebut,
		  memberCount:group.Nomiembros,
		  status:group.estadoGrupo,
		  agency:agency})
	  }

	  static toEntitiesSimple(groups:any[],agency:Agency):Group[]{
	    
		return groups.map(g=> this.toEntitySimple(g.grupo,agency))	
	}
	}

