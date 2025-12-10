// export class UpdateAlbumDto {
//     constructor(
//         public readonly idGroup: number,
//         public readonly title: string,
//         public readonly releaseDate: Date | string,
//         public readonly producer: string,
//         //public readonly noSongs: number,
//         public readonly noCopiesSold: number,
//         public readonly songs: Array<number>,
//         public readonly artists: Array<[number, number]>,
//         public readonly awards?: Array<number>,
//     ) {}

//     static create(body: any): UpdateAlbumDto {

//         return new UpdateAlbumDto(
//             body.idGroup,
//             body.title,
//             body.releaseDate,
//             body.producer,
//             body.noCopiesSold,
//             body.songs,
//             body.artists,
//             body.award
//         )
//     }
// }



export class UpdateAlbumDto {
    constructor(
        public readonly idGroup?: number,
        public readonly title?: string,
        public readonly releaseDate?: Date | string,
        public readonly producer?: string,
        public readonly noCopiesSold?: number,
        public readonly songs?: number[],
        public readonly artists?: Array<[number, number]>,
        public readonly awards?: number[],
    ) {}

    static create(body: any): UpdateAlbumDto {
        return new UpdateAlbumDto(
            body.idGroup,
            body.title,
            body.releaseDate,
            body.producer,
            body.noCopiesSold,
            body.songs,
            body.artists,
            body.awards // ✔ CORREGIDO (antes tenías body.award)
        );
    }
}