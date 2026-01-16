// CreateApplicationDto corregido
export class CreateRolApplicationDto {
    constructor(
        public readonly groupName: string,
        public readonly idAgency: number,
        public readonly idConcept: number,
        public readonly apprentices: Array<[number,string]>,
        public readonly artists:Array<[number, number, string]>,
        public readonly status: string,
        public readonly idApprentice: number,
        public readonly idGroup?: number 
    ) {}

    static create(body: any): CreateRolApplicationDto {
        if (!body.groupName || !body.idAgency || !body.idConcept || !body.idApprentice ) {
            throw new Error("Missing required fields");
        }
        
        if (!body.apprentices && !body.artists){
            throw new Error("No se presentan miembros para la creacion del grupo");
        }
        
        return new CreateRolApplicationDto(
            body.groupName, 
            body.idAgency, 
            body.idConcept,
            body.apprentices,
            body.artists,
            !body.status ? "PENDIENTE" :body.this.status,
            body.idApprentice,
            body.idGroup
        );
    }
}
