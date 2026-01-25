// CreateApplicationDto corregido
export class CreateApplicationDto {
    constructor(
        public readonly groupName: string,
        public readonly idAgency: number,
        public readonly idConcept: number,
        public readonly status: string,
        public readonly apprentices?: Array<[number,string]>,
        public readonly artists?:Array<[number, number,string]>,
    ) {}

    static create(body: any): CreateApplicationDto {
        if (!body.groupName || !body.idAgency || !body.idConcept) {
            throw new Error("Missing required fields");
        }
        
        return new CreateApplicationDto(
            body.groupName, 
            body.idAgency, 
            body.idConcept,
            !body.status ? "PENDIENTE" :body.status,
            body.apprentices,
            body.artists,
        );
    }
}
