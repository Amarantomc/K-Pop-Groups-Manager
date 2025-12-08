export class CreateAlbumDto {
    constructor(
        public readonly idGroup: number,
        public readonly idArt: number,
        public readonly title: string,
        public readonly releaseDate: Date | string,
        public readonly producer: string,
        public readonly noSongs: number,
        public readonly noCopiesSold: number
    ) {}

    static create(body: any): CreateAlbumDto {
        if (!body.idGroup || !body.idArt || !body.title || !body.releaseDate || !body.producer || !body.noSongs || !body.noCopiesSold) {
            throw new Error('Missing required fields');
        }
        return new CreateAlbumDto(
            body.idGroup,
            body.idArt,
            body.title,
            body.releaseDate,
            body.producer,
            body.noSongs,
            body.noCopiesSold
        );
    }
}
