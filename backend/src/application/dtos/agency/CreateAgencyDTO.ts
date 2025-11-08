export class CreateAgencyDTO {
	constructor(
		public readonly name: string,
		public readonly address: string,
		public readonly foundation: Date
	) {}

	static create(body: any): CreateAgencyDTO {
		if (!body.name || !body.address || !body.foundation) {
			throw new Error("Missing required fields");
		}
		return new CreateAgencyDTO(body.name, body.address, body.foundation);
	}
}
