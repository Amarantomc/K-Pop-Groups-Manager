import Album from "../../../domain/entities/Album";

export class AlbumResponseDTO {
	constructor(
		public readonly id: number,
		public readonly title: string,
		public readonly releaseDate: string,
		public readonly producer: string,
		public readonly noSongs: number,
		public readonly noCopiesSold: number,
		public readonly songs: Array<number>,
		public readonly artists: Array<number>,
		public readonly groups: Array<number>,
		public readonly awards: Array<number>
	) {}

	static fromEntity(album: Album): AlbumResponseDTO {
		return new AlbumResponseDTO(
			album.id,
			album.title,
			album.releaseDate.toString(),
			album.producer,
			album.noSongs,
			album.noCopiesSold,
			album.songs.map((song) => song.id),
			album.artists.map((artist) => artist.ApprenticeId),
			album.groups.map((group) => group.id),
			album.awards.map((award) => award.id)
		);
	}

	static fromEntities(albums: Array<Album>): AlbumResponseDTO[] {
		return albums.map((album) => this.fromEntity(album));
	}

	static toEntity(album: any): Album {
		return new Album({
			id: album.id,
			title: album.titulo,
			releaseDate: album.fechaLanzamiento,
			producer: album.productor,
			noSongs: album.NoCanciones,
			noCopiesSold: album.NoCopiasVendidas,
			songs: album.Canciones,
			artists: album.LanzamientoArtista,
			groups: album.LanzamientoGrupo,
		});
	}

	static toEntities(albums: any[]): Album[] {
		return albums.map((album) => this.toEntity(album));
	}
}
