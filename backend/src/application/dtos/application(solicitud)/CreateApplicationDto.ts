import type { Apprentice } from "../../../domain";
import type { Agency } from "../../../domain/entities/Agency";

export class CreateApplicationDto {
	constructor(
		public readonly name: string,
		public readonly description:string,
		public readonly date: Date,
		//public readonly agencys:Agency[],
		//public readonly apprentices: Apprentice[]
	) {}

	static create(body: any, apprentices: number[]|null): CreateApplicationDto {
		if (!body.name || !body.name || !body.date || apprentices) {
			throw new Error("Missing required fields");
		}
		return new CreateApplicationDto(body.name, body.description, body.date)
			//,body.agencys,body.apprentices);
	}
}
