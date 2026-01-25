export default class PopularityList {
    readonly id: number;
    readonly name: string;
    readonly listType: string;
    readonly requirement: number;
    readonly songs: { id: number; title: string; position: number, year?: number }[];

    constructor(attrs: {
        id: number;
        name: string;
        listType: string;
        requirement: number
        songs: { id: number; title: string; position: number, year?: number, }[];
    }) {
        this.id = attrs.id;
        this.name = attrs.name;
        this.listType = attrs.listType;
        this.songs = attrs.songs;
        this.requirement = attrs.requirement
    }
}