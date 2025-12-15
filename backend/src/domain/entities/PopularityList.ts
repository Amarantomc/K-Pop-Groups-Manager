export default class PopularityList {
    readonly id: number;
    readonly name: string;
    readonly listType: string;
    readonly requeriment: number;
    readonly songs: { id: number; title: string; position: number, year?: number }[];

    constructor(attrs: {
        id: number;
        name: string;
        listType: string;
        requeriment: number
        songs: { id: number; title: string; position: number, year?: number, }[];
    }) {
        this.id = attrs.id;
        this.name = attrs.name;
        this.listType = attrs.listType;
        this.songs = attrs.songs;
        this.requeriment = attrs.requeriment
    }
}