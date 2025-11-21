import { GroupStatus } from "../enums/GroupStatus";
import { Agency } from "./Agency";
import { Concept } from "./Concept";
import { VisualConcept } from "./VisualConcept";
import { Artist } from "./Artist";
import { Activity } from "./Activity";

export class Group {
	readonly id: number;
	readonly name: string;
	readonly debut: Date;
	readonly members: Artist[];
	readonly status: GroupStatus;
	readonly agency: Agency;
	readonly concept: Concept;
	readonly visualConcept: VisualConcept;
	readonly activities: Activity[];

	constructor(attrs: {
		id: number;
		name: string;
		debut: Date;
		members: Artist[];
		status: GroupStatus;
		agency: Agency;
		concept: Concept;
		visualConcept: VisualConcept;
		activities: Activity[];
	}) {
		this.id = attrs.id;
		this.name = attrs.name;
		this.debut = attrs.debut;
		this.members = attrs.members;
		this.status = attrs.status;
		this.agency = attrs.agency;
		this.concept = attrs.concept;
		this.visualConcept = attrs.visualConcept;
		this.activities = attrs.activities;
	}
}
