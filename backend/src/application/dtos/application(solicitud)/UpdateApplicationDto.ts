
export class UpdateApplicationDto {
    constructor(
        public readonly groupName?: string,
        public readonly roles?: string[],
        public readonly status?: string,
    ) {}

    static create(body: any): UpdateApplicationDto {
        if (!body.groupName) {
            throw new Error("Missing required fields");
        }
        if(!body.roles ){
            throw new Error("Missing required fields");
        }
        if(!body.status || body.status === "Pendiente" || body.status === "Aprobado" || body.status === "Rechazado" || body.statud === "Terminado"){
            throw new Error("invalid Status");
        }
        return new UpdateApplicationDto(body.groupName,body.roles,body.status)
    }
}
