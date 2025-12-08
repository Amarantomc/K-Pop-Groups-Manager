export default class Application {
    readonly id: number;
    readonly date: Date | string;
    readonly idAgency: number;
    readonly roles: string[];
    readonly idConcept: number;
    readonly groupName: string;
    readonly apprentices: number[];
    readonly artists:[number,number][];
    readonly estado: string;

    constructor(attrs: {
        id: number;
        date: Date | string;
        idAgency: number;
        roles: string[];
        idConcept: number;
        groupName:string;
        apprentices:number[];
        artists:[number,number][];
        estado: string;
    }) {
        this.id = attrs.id;
        this.date = attrs.date;
        this.idAgency = attrs.idAgency;
        this.roles = attrs.roles;
        this.idConcept = attrs.idConcept;
        this.groupName = attrs.groupName;
        this.apprentices = attrs.apprentices;
        this.artists = attrs.artists;
        this.estado = attrs.estado;
    }
}