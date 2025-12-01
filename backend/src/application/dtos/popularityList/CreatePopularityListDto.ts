import type { Song } from "../../../domain";

export class CreatePopularityListDto {
	constructor(
		public readonly name: string,
		public readonly listType: string,
		public readonly songs: Array<Song>
	) {}

	static create(body: any): CreatePopularityListDto {
		if (!body.name || !body.listType || !body.songs) {
			throw new Error("Missing required fields");
		}
		if(!(body.listType === "Nacional") || !(body.listType === "Internacional")){
			throw new Error("");
		}
		return new CreatePopularityListDto(body.name, body.listType, body.songs);
	}
}
