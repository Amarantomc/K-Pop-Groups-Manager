// import type { Artist } from "./Artist"
// import type Award from "./Award"
// import type Song from "./Song"

// export default class Album {
//     readonly id: number;
//     readonly idGroup: number;
//     readonly title: string;
//     readonly releaseDate: Date | string;
//     readonly producer: string;
//     readonly noSongs: number;
//     readonly noCopiesSold: number;
//     readonly songs: Array<number> | undefined;
//     readonly artists: Array<number>;
//     readonly awards?: Array<number>;
//     readonly groups: Array<number>;


//     constructor(attrs: {
//         id: number;
//         idGroup: number;
//         title: string;
//         releaseDate: Date | string;
//         producer: string;
//         noSongs: number;
//         noCopiesSold: number;
//         songs: Array<number> | undefined;
//         artists: Array<number>;
//         awards?: Array<number>;
//         groups:Array<number>;
//     }) {
//         this.id = attrs.id;
//         this.idGroup = attrs.idGroup;
//         this.title = attrs.title;
//         this.releaseDate = attrs.releaseDate;
//         this.producer = attrs.producer;
//         this.noSongs = attrs.noSongs;
//         this.noCopiesSold = attrs.noCopiesSold;
//         this.songs = attrs.songs;
//         this.artists = attrs.artists;
//         this.groups = attrs.groups;

//         // Interrelaciones q admiten null o ningun elemento 
//         this.awards = attrs.awards ?? [];
//     }
// }

export default class Album {
    readonly id: number;
    readonly idGroup: number;
    readonly title: string;
    readonly releaseDate: Date | string;
    readonly producer: string;
    readonly noSongs: number;
    readonly noCopiesSold: number;

    // IDs de canciones
    readonly songs: number[];

    // Artistas del álbum (pares idAp, idGr)
    readonly artists: { idAp: number; idGr: number }[];

    // Premios del álbum (idPremio, año)
    readonly awards: { idPremio: number; año: number }[];

    // Grupos (IDs)
    readonly groups: number[];

    constructor(attrs: {
        id: number;
        idGroup: number;
        title: string;
        releaseDate: Date | string;
        producer: string;
        noSongs: number;
        noCopiesSold: number;

        songs: number[];
        artists: { idAp: number; idGr: number }[];
        awards?: { idPremio: number; año: number }[];
        groups: number[];
    }) {
        this.id = attrs.id;
        this.idGroup = attrs.idGroup;
        this.title = attrs.title;
        this.releaseDate = attrs.releaseDate;
        this.producer = attrs.producer;
        this.noSongs = attrs.noSongs;
        this.noCopiesSold = attrs.noCopiesSold;

        this.songs = attrs.songs;
        this.artists = attrs.artists;
        this.groups = attrs.groups;

        // Interrelación que puede venir vacía
        this.awards = attrs.awards ?? [];
    }
}