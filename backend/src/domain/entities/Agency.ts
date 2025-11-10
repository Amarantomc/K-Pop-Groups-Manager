export class Agency {
	readonly id: number;
	readonly name: string;
	readonly address: string;
	readonly foundation: Date;

	constructor(attrs: {
		id: number;
		name: string;
		address: string;
		foundation: Date;
	}) {
		this.id = attrs.id;
		this.name = attrs.name;
		this.address = attrs.address;
		this.foundation = attrs.foundation;
	}
}
