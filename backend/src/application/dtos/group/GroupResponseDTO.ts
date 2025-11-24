import { Group } from "../../../domain/entities/Group";
import { GroupStatus } from "../../../domain/enums/GroupStatus";

export class GroupResponseDTO {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly debut: Date,
		public readonly status: GroupStatus,
		public readonly memberCount: number,
		public readonly agency: number,
		public readonly concept: number,
		public readonly visualConcept: number,
		public readonly members: number[] = [],
		public readonly albums: number[] = [],
		public readonly activities: number[] = []
	) {}

	static fromEntity(group: any): GroupResponseDTO {
		return new GroupResponseDTO(
			group.id,
			group.name,
			group.debut,
			group.status,
			group.memberCount,
			group.agency,
			group.concept,
			group.visualConcept,
			group.members || [],
			group.albums || [],
			group.activities || []
		);
	}

	static toEntity(group: any): Group {
		return new Group({
			id: group.id,
			name: group.name,
			debut: group.debut,
			memberCount: group.memberCount,
			status: group.status,
			agency: group.agency,
			concept: group.concept,
			visualConcept: group.visualConcept,
		});
	}

	static fromEntities(groups: any[]): GroupResponseDTO[] {
		return groups.map((group) => this.fromEntity(group));
	}
}
