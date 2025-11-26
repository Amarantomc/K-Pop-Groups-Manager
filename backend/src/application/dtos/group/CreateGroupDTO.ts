import { GroupStatus } from "../../../domain/enums/GroupStatus";

export class CreateGroupDTO {
	constructor(
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

	static Create(body: any): CreateGroupDTO {
		if (
			!body.name ||
			!body.debut ||
			!body.status ||
			body.memberCount === undefined ||
			!body.IdAgency ||
			!body.IdConcept ||
			!body.IdVisualConcept ||
			!body.members
		)
			throw new Error("Missing required fields");

		if (!(body.status in GroupStatus)) throw new Error("Invalid Status");
		if (
			!Array.isArray(body.members) ||
			body.members.length == 0 ||
			!body.members.every((m: any) => typeof m === "number" && !isNaN(m))
		)
			throw new Error("List of members must be a nonempty array of numbers");

		return new CreateGroupDTO(
			body.name,
			new Date(body.debut),
			body.status,
			body.memberCount,
			body.IdAgency,
			body.concept,
			body.visualConcept,
			body.members,
			body.albums,
			body.activities
		);
	}
}
