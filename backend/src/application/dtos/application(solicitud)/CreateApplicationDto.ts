// CreateApplicationDto corregido
export class CreateApplicationDto {
    constructor(
        public readonly groupName: string,
        public readonly idAgency: number,
        public readonly idConcept: number,
        public readonly apprentices: Array<[number,string]>,
        public readonly artists:Array<[number, number,string]>,
        public readonly status: string,
    ) {}

    static create(body: any): CreateApplicationDto {
        if (!body.groupName || !body.idAgency || !body.idConcept) {
            throw new Error("Missing required fields");
        }
        
        return new CreateApplicationDto(
            body.groupName, 
            body.idAgency, 
            body.idConcept,
            body.apprentices,
            body.artists,
            !body.status ? "PENDIENTE" :body.this.status,
        );
    }
}
