import { GroupStatus } from "../../../domain/enums/GroupStatus";

export class CreateGroupDTO {
	constructor(
		public readonly name: string,
		public readonly debut: Date,
		public readonly status: string,
		public readonly memberCount: number,
		public readonly agency: number,
		public readonly concept: number,
		public readonly visualConcept: number,
		// IDs de las relaciones múltiples
		public readonly members: number[] = [],
		public readonly albums: number[] = [],
		public readonly activities: number[] = []
	) {}

	static Create(body: any): CreateGroupDTO {
		if (
			!body.name ||
			!body.debut ||
			!body.status ||
			body.memberCount === undefined ||
			!body.agency ||
			!body.concept ||
			!body.visualConcept
		) {
			throw new Error("Missing required fields");
		}
		if (!(body.status in GroupStatus)) {
			throw new Error("Invalid Status");
		}
		return new CreateGroupDTO(
			body.name,
			new Date(body.debut),
			body.status,
			Number(body.memberCount),
			Number(body.agency),
			Number(body.concept),
			Number(body.visualConcept),
			Array.isArray(body.members) ? body.members.map(Number) : [],
			Array.isArray(body.albums) ? body.albums.map(Number) : [],
			Array.isArray(body.activities) ? body.activities.map(Number) : []
		);
	}
}
