import { Group } from "../../../domain/entities/Group";

export class GroupResponseDTO {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly debut: Date,
		public readonly status: string,
		public readonly memberCount: number,
		public readonly IdAgency: number,
		public readonly IdConcept: number,
		public readonly IdVisualConcept: number,
		public readonly members: number[],
		public readonly albums?: number[],
		public readonly activities?: number[]
	) {}

	static fromEntity(group: any): GroupResponseDTO {
		return new GroupResponseDTO(
			group.id,
			group.name,
			group.debut,
			group.status,
			group.memberCount,
			group.agency.id,
			group.concept.id,
			1, // Cambiar por: group.visualConcept.id
			group.members,
			group.albums,
			group.activities
		);
	}

	static toEntity(group: any): Group {
		return new Group({
			id: group.id,
			name: group.nombreCompleto || group.name,
			debut: group.fechaDebut || group.debut,
			memberCount: group.Nomiembros || group.memberCount,
			status: group.estadoGrupo || group.status,
			agency: group.agency || group.Agencias?.[0] || null,
			concept:
				group.concept ||
				group.concepto ||
				(group.idConcepto ? { id: group.idConcepto } : null),
			visualConcept: group.visualConcept || null,
		});
	}

	static fromEntities(groups: any[]): GroupResponseDTO[] {
		return groups.map((group) => this.fromEntity(group));
	}
}
