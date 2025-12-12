export default class Album {
    readonly id: number;
    readonly idGroup: number;
    readonly title: string;
    readonly releaseDate: Date | string;
    readonly producer: string;
    readonly noSongs: number;
    readonly noCopiesSold: number;

    readonly songs: { id: number; name: string }[];
    readonly artists: { idAp: number; idGr: number; artisticName: string }[];
    readonly awards: { idAward: number; year: number; title: string }[];
    readonly groups: { idGr: number; groupName: string }[];

    constructor(attrs: {
        id: number;
        idGroup: number;
        title: string;
        releaseDate: Date | string;
        producer: string;
        noSongs: number;
        noCopiesSold: number;

        songs: { id: number; name: string }[];
        artists: { idAp: number; idGr: number; artisticName: string }[];
        awards?: { idAward: number; year: number; title: string }[];
        groups: { idGr: number; groupName: string }[];
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

        this.awards = attrs.awards ?? [];
    }
}