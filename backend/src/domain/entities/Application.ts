export default class Application {
    readonly id: number;
    readonly date: Date | string;
    readonly description: string;

    constructor(attrs: {
        id: number;
        date: Date | string;
        description: string;
    }) {
        this.id = attrs.id;
        this.date = attrs.date;
        this.description = attrs.description;
    }
}