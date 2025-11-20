import { Group } from "../../../domain/entities/Group";

export class GroupResponseDTO {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly debut: Date,
		public readonly members: number,
		public readonly status: string,
		public readonly agency: number,
		public readonly concept: number,
		public readonly visualConcept: number
	) {}

	static fromEntity(group: any): GroupResponseDTO {
		return new GroupResponseDTO(
			group.id,
			group.name,
			group.debut,
			group.members,
			group.status,
			group.agency,
			group.concept,
			group.visualConcept
		);
	}

	static toEntity(group: any): Group {
		return new Group({
			id: group.id,
			name: group.name,
			debut: group.debut,
			members: group.members,
			status: group.status.toString(),
			agency: group.agency,
			concept: group.concept,
			visualConcept: group.visualConcept,
		});
	}

	static fromEntities(groups: any[]): GroupResponseDTO[] {
		return groups.map((group) => this.fromEntity(group));
	}
}
