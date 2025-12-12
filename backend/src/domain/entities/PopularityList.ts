export default class PopularityList {
    readonly id: number;
    readonly name: string;
    readonly listType: string;
    readonly songs: { id: number; title: string; position: number }[];

    constructor(attrs: {
        id: number;
        name: string;
        listType: string;
        songs: { id: number; title: string; position: number }[];
    }) {
        this.id = attrs.id;
        this.name = attrs.name;
        this.listType = attrs.listType;
        this.songs = attrs.songs;
    }
}