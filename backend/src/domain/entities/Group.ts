import { GroupStatus } from "../enums/GroupStatus";

export class Group {
	readonly id: number;
	readonly name: string;
	readonly debut: Date;
	readonly status: GroupStatus;
	readonly agency: number;

	constructor(attrs: {
		id: number;
		name: string;
		debut: Date;
		status: GroupStatus;
		agency: number;
	}) {
		this.id = attrs.id;
		this.name = attrs.name;
		this.debut = attrs.debut;
		this.status = attrs.status;
		this.agency = attrs.agency;
	}
}
