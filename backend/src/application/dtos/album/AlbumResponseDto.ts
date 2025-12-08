import Album from '../../../domain/entities/Album'

export class AlbumResponseDto {
    constructor(
        public readonly id: number,
        public readonly idGroup: number,
        public readonly idArt: number,
        public readonly title: string,
        public readonly releaseDate: Date | string,
        public readonly producer: string,
        public readonly noSongs: number,
        public readonly noCopiesSold: number
    ) {}

    static fromEntity(album: any): AlbumResponseDto {
        return new AlbumResponseDto(
            album.id,
            album.idGroup,
            album.idArt,
            album.title,
            album.releaseDate,
            album.producer,
            album.noSongs,
            album.noCopiesSold
        );
    }

    static fromEntities(albums: any[]): AlbumResponseDto[] {
        return albums.map(album => this.fromEntity(album));
    }
}
