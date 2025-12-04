

export class CreatePopularityListDto {
	constructor(
		public readonly name: string,
		public readonly listType: string
		
	) {}

	static create(body: any): CreatePopularityListDto {
		console.log(body)
		if (!body.name || !body.listType) {
			throw new Error("Missing required fields");
		}
		if( !(['Nacional','Internacional'].find(x=> x==body.listType))){
			throw new Error("Invalid Type");
		}
		return new CreatePopularityListDto(body.name, body.listType);
	}
}
