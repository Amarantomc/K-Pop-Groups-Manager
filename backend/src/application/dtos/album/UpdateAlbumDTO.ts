export class UpdateAlbumDTO {
	constructor(
		public readonly title: string | undefined,
		public readonly releaseDate: Date | undefined,
		public readonly producer: string | undefined,
		public readonly noCopiesSold: number | undefined
	) {}

	static Create(body: any): UpdateAlbumDTO {
		if (
			body.songs &&
			(!Array.isArray(body.songs) ||
				body.songs.length == 0 ||
				body.songs.every((song: any) => typeof song !== "number"))
		)
			throw new Error("Album's song list must be a nonempty number array");

		return new UpdateAlbumDTO(
			body.title || undefined,
			body.releaseDate || undefined,
			body.producer || undefined,
			body.noCopiesSold || undefined
		);
	}
}
