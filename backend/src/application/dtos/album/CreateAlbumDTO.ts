import { isDate } from "util/types";

export class CreateAlbumDTO {
	constructor(
		public readonly title: string,
		public readonly releaseDate: Date | string,
		public readonly producer: string,
		public readonly songs: Array<number>,
		public readonly artists: Array<number>,
		public readonly groups: Array<number>
	) {}

	static Create(body: any): CreateAlbumDTO {
		if (!body.title) throw new Error("Missing album title");
		if (!body.releaseDate) throw new Error("Missing album release date");
		if (!isDate(new Date(body.releaseDate)))
			throw new Error("Release Date must be a valid date");
		if (!body.producer) throw new Error("Missing album producer");
		if (!body.songs) throw new Error("Missing album song list");
		if (
			!Array.isArray(body.songs) ||
			body.songs.length == 0 ||
			body.songs.every((song: any) => typeof song !== "number")
		)
			throw new Error("Album's song list must be a nonempty number array");
		if (!body.artists && !body.groups)
			throw new Error(
				"Album must have a list of groups or a list of artists, optionally both"
			);
		if (
			body.artists &&
			(!Array.isArray(body.artists) ||
				body.artists.length == 0 ||
				body.artists.every(
					(artist: any) =>
						!Array.isArray(artist) ||
						artist.length != 2 ||
						artist.every((id: any) => typeof id !== "number")
				))
		)
			throw new Error(
				"Album's artists list must be a nonempty array of two-number array"
			);
		if (
			body.groups &&
			(!Array.isArray(body.groups) ||
				body.groups.length == 0 ||
				body.groups.every((group: any) => typeof group !== "number"))
		)
			throw new Error("Album's groups list must be a nonempty number array");

		return new CreateAlbumDTO(
			body.title,
			body.releaseDate,
			body.producer,
			body.songs,
			body.artists || [],
			body.groups || []
		);
	}
}
