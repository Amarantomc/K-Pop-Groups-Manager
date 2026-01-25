

export class CreatePopularityListDto {
	constructor(
		public readonly name: string,
		public readonly listType: string,
		public readonly requirement?: number,
		
	) {}

	static create(body: any): CreatePopularityListDto {
		if (!body.name || !body.listType || !body.requirement) {
			throw new Error("Missing required fields");
		}
		if( !(['Nacional','Internacional'].find(x=> x==body.listType))){
			throw new Error("Invalid Type");
		}
		return new CreatePopularityListDto(body.name, body.listType, body.requirement);
	}
}
