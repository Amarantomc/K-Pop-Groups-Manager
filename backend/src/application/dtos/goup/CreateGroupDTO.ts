import { GroupStatus } from "../../../domain/enums/GroupStatus";

export class CreateGroupDTO {
	constructor(
		public readonly name: string,
		public readonly debut: Date,
		public readonly members: number,
		public readonly status: string,
		public readonly agency: number,
		public readonly concept: number,
		public readonly visualConcept: number
	) {}

	static Create(body: any): CreateGroupDTO {
		if (
			!body.name ||
			!body.debut ||
			!body.members ||
			!body.status ||
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
			body.debut,
			body.members,
			body.status,
			body.agency,
			body.concept,
			body.visualConcept
		);
	}
}
