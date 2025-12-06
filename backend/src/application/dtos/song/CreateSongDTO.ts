export class CreateSongDTO {
	constructor(
		public readonly title: string,
		public readonly releaseDate: Date,
		public readonly producer: string,
		public readonly genre: string,
		public readonly albums: Array<number>
	) {}

	static Create(body: any): CreateSongDTO {
		if (!body.title) throw new Error("Missing song title");
		if (!body.releaseDate) throw new Error("Missing song release date");
		if (!body.producer) throw new Error("Missing song producer");
		if (!body.genre) throw new Error("Missing song genre");
		if (!body.albums) throw new Error("Missing song album list");
		if (
			!Array.isArray(body.albums) ||
			body.albums.length == 0 ||
			body.albums.every((album: any) => typeof album !== "number")
		)
			throw new Error("Song's album list must be a nonempty number array");

		return new CreateSongDTO(
			body.title,
			body.releaseDate,
			body.producer,
			body.genre,
			body.albums
		);
	}
}
