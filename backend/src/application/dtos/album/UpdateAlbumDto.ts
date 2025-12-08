export class UpdateAlbumDto {
    constructor(
        public readonly title?: string,
        public readonly releaseDate?: Date | string,
        public readonly producer?: string,
        public readonly noSongs?: number,
        public readonly noCopiesSold?: number
    ) {}

    static create(body: any): UpdateAlbumDto {
        return new UpdateAlbumDto(
            body.title,
            body.releaseDate,
            body.producer,
            body.noSongs,
            body.noCopiesSold
        );
    }
}
