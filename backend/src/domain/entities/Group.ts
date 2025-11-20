import { GroupStatus } from "../enums/GroupStatus";

export class Group {
	readonly id: number;
	readonly name: string;
	readonly debut: Date;
	readonly members: number;
	readonly status: GroupStatus;
	readonly agency: number;
	readonly concept: number;
	readonly visualConcept: number;

	constructor(attrs: {
		id: number;
		name: string;
		debut: Date;
		members: number;
		status: GroupStatus;
		agency: number;
		concept: number;
		visualConcept: number;
	}) {
		this.id = attrs.id;
		this.name = attrs.name;
		this.debut = attrs.debut;
		this.members = attrs.members;
		this.status = attrs.status;
		this.agency = attrs.agency;
		this.concept = attrs.concept;
		this.visualConcept = attrs.visualConcept;
	}
}
