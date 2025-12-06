import { Song } from "../../../domain/entities/Song";

export class SongResponseDTO {
	constructor(
		public readonly id: number,
		public readonly title: string,
		public readonly releaseDate: string,
		public readonly producer: string,
		public readonly genre: string,
		public readonly albums: number[],
		public readonly popularityLists: number[]
	) {}

	static fromEntity(song: Song): SongResponseDTO {
		return new SongResponseDTO(
			song.id,
			song.title,
			song.releaseDate.toDateString(),
			song.producer,
			song.genre,
			song.albums.map((album) => album.id),
			song.popularityLists.map((poplist) => poplist.id)
		);
	}

	static fromEntities(songs: Array<Song>): SongResponseDTO[] {
		return songs.map((song) => this.fromEntity(song));
	}

	static toEntity(song: any): Song {
		return new Song({
			id: song.id,
			title: song.titulo,
			releaseDate: song.fechaLanzamiento,
			producer: song.productor,
			genre: song.genero,
			albums: song.Albums,
			popularityLists: song.ListaDePopularidad,
		});
	}

	static toEntities(songs: any[]): Song[] {
		return songs.map((song) => this.toEntity(song));
	}
}
