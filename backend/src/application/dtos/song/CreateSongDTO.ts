export class CreateAlbumDTO {
	constructor(
		public readonly title: string,
		public readonly releaseDate: Date,
		public readonly producer: string,
		public readonly songs: Array<number>
	) {}

	static Create(body: any): CreateAlbumDTO {
		if (!body.title) throw new Error("Missing album title");
		if (!body.releaseDate) throw new Error("Missing album release date");
		if (!body.producer) throw new Error("Missing album producer");
		if (!body.songs) throw new Error("Missing album song list");
		if (
			!Array.isArray(body.albums) ||
			body.albums.length == 0 ||
			body.albums.every((album: any) => typeof album !== "number")
		)
			throw new Error("Song's album list must be a nonempty number array");

		return new CreateAlbumDTO(
			body.title,
			body.releaseDate,
			body.producer,
			body.songs
		);
	}
}
