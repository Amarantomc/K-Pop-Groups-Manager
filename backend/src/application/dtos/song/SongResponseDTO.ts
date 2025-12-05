import Song from "../../../domain/entities/Song";
import PopularityList from "../../../domain/entities/PopularityList";

export class SongResponseDTO {
	constructor(
		public readonly id: number,
		public readonly title: string,
		public readonly releaseDate: string,
		public readonly producer: string,
		public readonly gender: string,
		public readonly popularityLists: number[],
		public readonly albums: number[]
	) {}

	static fromEntity(song: Song): SongResponseDTO {
		return new SongResponseDTO(
			song.id,
			song.title,
			song.releaseDate.toDateString(),
			song.producer,
			song.gender,
			song.popularityLists.map((poplist) => poplist.id),
			song.albums.map((album) => album.id)
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
			gender: song.genero,
			popularityLists: song.ListaDePopularidad || [],
			albums: song.Albums || [],
		});
	}

	static toEntities(songs: any[]): Song[] {
		return songs.map((song) => this.toEntity(song));
	}
}
