export class CreateAlbumDto {
    constructor(
        public readonly idGroup: number | null,
        public readonly title: string,
        public readonly releaseDate: Date | string,
        public readonly producer: string,
        //public readonly noSongs: number,
        public readonly noCopiesSold: number,
        public readonly songs: Array<number>,
        public readonly artists: Array<[number, number]>,
        public readonly awards?: Array<number>,
    ) {}

    static create(body: any): CreateAlbumDto {

        if (!body.title || !body.releaseDate || !body.producer /*|| !body.noSongs*/ || !body.noCopiesSold) {
            throw new Error("Missing required fields");
        }

        if (!Array.isArray(body.songs)) {
            throw new Error("Songs must be an array of numbers");
        }

        if (!Array.isArray(body.artists)) {
            throw new Error("Artists must be an array of [idArtist, idGroup]");
        }

        if (body.awards && !Array.isArray(body.awards)) {
            throw new Error("Awards must be an array of numbers");
        }

        return new CreateAlbumDto(
            body.idGroup ?? null,
            body.title,
            body.releaseDate,
            body.producer,
            //body.noSongs,
            body.noCopiesSold,
            body.songs,
            body.artists,
            body.awards ?? []
        );
    }
}