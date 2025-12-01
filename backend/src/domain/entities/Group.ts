import { GroupStatus } from "../enums/GroupStatus";
import { Agency } from "./Agency";
import { Concept } from "./Concept";
import { VisualConcept } from "./VisualConcept";

export class Group {
	readonly id: number;
	readonly name: string;
	readonly debut: Date;
	readonly status: GroupStatus;
	readonly memberCount: number;
	readonly agency: Agency;
	readonly concept: Concept;
	readonly visualConcept: VisualConcept;

	constructor(attrs: {
		id: number;
		name: string;
		debut: Date;
		status: GroupStatus;
		memberCount: number;
		agency: Agency;
		concept: Concept;
		visualConcept: VisualConcept;
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
