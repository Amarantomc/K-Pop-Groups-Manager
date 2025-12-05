import { GroupStatus } from "../enums/GroupStatus";
import type { Activity } from "./Activity";
import { Agency } from "./Agency";
import type Album from "./Album";
import type { Artist } from "./Artist";
import { Concept } from "./Concept";
import type VisualConcept from "./VisualConcept";
//import { VisualConcept } from "./VisualConcept";

export class Group {
	readonly id: number;
	readonly name: string;
	readonly debut: Date;
	readonly status: GroupStatus;
	readonly memberCount: number;
	readonly agency: Agency;
	readonly concept ?: Concept |undefined;
	readonly visualConcept?: VisualConcept |undefined;
	readonly members?:Artist[]|undefined
	readonly albums?:Album[] |undefined
	readonly activities?:Activity[] |undefined

	constructor(attrs: {
		id: number;
		name: string;
		debut: Date;
		status: GroupStatus;
		memberCount: number;
		agency: Agency;
		concept?: Concept;
		visualConcept?: VisualConcept;
		members?:Artist[]
		albums?:Album[]
		activities?:Activity[]
		
	}) {
		this.id = attrs.id;
		this.name = attrs.name;
		this.debut = attrs.debut;
		this.status = attrs.status;
		this.memberCount = attrs.memberCount;
		this.agency = attrs.agency;
		this.concept = attrs.concept;
		this.visualConcept = attrs.visualConcept;
		this.members = attrs.members;
		this.albums = attrs.albums;
		this.activities=attrs.activities
	}
}
