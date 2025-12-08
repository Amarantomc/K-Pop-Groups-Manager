// CreateApplicationDto corregido
export class CreateApplicationDto {
    constructor(
        public readonly groupName: string,
        public readonly idAgency: number,
        public readonly roles: string[],
        public readonly idConcept: number,
        public readonly apprentices: Array<number>,
        public readonly artists:Array<[number, number]>,
    ) {}

    static create(body: any): CreateApplicationDto {
        if (!body.groupName || !body.idAgency || !body.idConcept || !body.roles) {
            throw new Error("Missing required fields");
        }
        // Validar que roles sea un array
        if (!Array.isArray(body.roles)) {
            throw new Error("Roles must be an array");
        }
        return new CreateApplicationDto(
            body.groupName, 
            body.idAgency, 
            body.roles,
            body.idConcept,
            body.apprentices,
            body.artists
        );
    }
}
