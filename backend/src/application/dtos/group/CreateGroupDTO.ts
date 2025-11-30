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
		if (!body.name) throw new Error("Missing group name");
		if (!body.debut) throw new Error("Missing group's debut date");
		if (isNaN(Date.parse(body.debut)))
			throw new Error("Invalid debut date format");
		if (!body.status) throw new Error("Missing group's status");
		if (!(body.status in GroupStatus)) throw new Error("Invalid group status");
		if (!body.IdAgency) throw new Error("Missing group's agency ID");
		if (isNaN(Number(body.IdAgency)))
			throw new Error("Group's agency ID must be a number");
		if (!body.IdConcept) throw new Error("Missing group's concept ID");
		if (isNaN(Number(body.IdConcept)))
			throw new Error("Group's concept ID must be a number");
		if (!body.IdVisualConcept)
			throw new Error("Missing group's visual concept ID");
		if (isNaN(Number(body.IdVisualConcept)))
			throw new Error("Group's visual concept ID must be a number");
		if (!body.members) throw new Error("Missing group's members list");
		if (
			!Array.isArray(body.members) ||
			body.members.length == 0 ||
			!body.members.every((m: any) => typeof m === "number" && !isNaN(m))
		)
			throw new Error(
				"Group's members list must be a nonempty array of numbers"
			);

		return new CreateGroupDTO(
			body.name,
			new Date(body.debut),
			String(body.status),
			Number(body.members.length),
			Number(body.IdAgency),
			Number(body.IdConcept),
			Number(body.IdVisualConcept),
			body.members.map((member: any) => Number(member)),
			body.albums?.map((album: any) => Number(album)),
			body.activities?.map((activity: any) => Number(activity))
		);
	}
}
