import { GroupStatus } from "../enums/GroupStatus";

export class Group {
	readonly id: number;
	readonly name: string;
	readonly debut: Date;
	readonly status: GroupStatus;
	readonly memberCount: number;

	// IDs de relaciones únicas
	readonly agency: number;
	readonly concept: number;
	readonly visualConcept: number;

	constructor(attrs: {
		id: number;
		name: string;
		debut: Date;
		status: GroupStatus;
		memberCount: number;
		agency: number;
		concept: number;
		visualConcept: number;
	}) {
		this.id = attrs.id;
		this.name = attrs.name;
		this.debut = attrs.debut;
		this.status = attrs.status;
		this.memberCount = attrs.memberCount;
		this.agency = attrs.agency;
		this.concept = attrs.concept;
		this.visualConcept = attrs.visualConcept;
	}
}
