export default class Album {
    readonly id: number;
    readonly title: string;
    readonly releaseDate: Date;
    readonly producer: string;
    readonly noSongs: number;
    readonly noCopiesSold: number;
    readonly apprenticeId?:number|undefined
    readonly groupId?: number |undefined;
    readonly songs?: { id: number; name: string }[]|undefined;
    
    readonly awards?: { idAward: number; year: number; title: string }[];
   

    constructor(attrs: {
        id: number;
        title: string;
        releaseDate: Date;
        producer: string;
        noSongs: number;
        noCopiesSold: number;
       apprenticeId?:number,
        groupId?: number;
        songs?: { id: number; name: string }[] |undefined;
        awards?: { idAward: number; year: number; title: string }[];
       
    }) {
        this.id = attrs.id;
       
        this.title = attrs.title;
        this.releaseDate = attrs.releaseDate;
        this.producer = attrs.producer;
        this.noSongs = attrs.noSongs;
        this.noCopiesSold = attrs.noCopiesSold;
        this.apprenticeId=attrs.apprenticeId
         this.groupId = attrs.groupId;
        this.songs = attrs.songs;
        this.awards = attrs.awards ?? [];
    }
}