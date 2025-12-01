export class CreateAlbumDTO {
	constructor(
		public readonly title: string,
		public readonly releaseDate: Date,
		public readonly producer: string,
		public readonly noSongs: number,
		public readonly noCopiesSold: number,
		public readonly songs: Array<number>
	) {}

	static Create(body: any): CreateAlbumDTO {
		if (!body.title) throw new Error("Missing album title");
		if (!body.releaseDate) throw new Error("Missing album release date");
		if (!body.producer) throw new Error("Missing album producer");
		if (!body.noCopiesSold) throw new Error("Missing album's sold copies");
		if (!body.songs) throw new Error("Missing album's songs");
		if (
			!Array.isArray(body.songs) ||
			body.songs.length == 0 ||
			body.songs.every((song: any) => typeof song !== "number")
		)
			throw new Error("Album's song list must be a nonempty number array");

		return new CreateAlbumDTO(
			body.title,
			body.releaseDate,
			body.producer,
			body.songs.length,
			body.noCopiesSold,
			body.songs
		);
	}
}
