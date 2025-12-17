// CreateApplicationDto corregido
export class CreateRolApplicationDto {
    constructor(
        public readonly groupName: string,
        public readonly idAgency: number,
        public readonly roles: string[],
        public readonly idConcept: number,
        public readonly apprentices: Array<number>,
        public readonly artists:Array<[number, number]>,
        public readonly status: string,
        public readonly idApprentice: number,
        public readonly idGroup?: number 
    ) {}

    static create(body: any): CreateRolApplicationDto {
        if (!body.groupName || !body.idAgency || !body.idConcept || !body.roles) {
            throw new Error("Missing required fields");
        }
        // Validar que roles sea un array
        if (!Array.isArray(body.roles)) {
            throw new Error("Roles must be an array");
        }
        
        return new CreateRolApplicationDto(
            body.groupName, 
            body.idAgency, 
            body.roles,
            body.idConcept,
            body.apprentices,
            body.artists,
            !body.status ? "PENDIENTE" :body.this.status,
            body.idApprentice,
            body.idGroup
        );
    }
}
