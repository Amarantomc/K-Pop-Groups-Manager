import type Album from "./Album"

export default class Award {
    readonly id: number;
    readonly awardTitle: string;
    readonly academyName: string;
    readonly albums: Array<Album>;

    constructor(attrs: {
        id: number;
        awardTitle: string;
        academyName: string;
        albums?: Array<Album>;
    }) {
        this.id = attrs.id;
        this.awardTitle = attrs.awardTitle;
        this.academyName = attrs.academyName;

        // por defecto puede ser vacio el array
        this.albums = attrs.albums ?? [];
    }
}