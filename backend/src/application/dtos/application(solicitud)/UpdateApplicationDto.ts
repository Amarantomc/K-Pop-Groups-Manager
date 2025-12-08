
export class UpdateApplicationDto {
    constructor(
        public readonly groupName?: string,
        public readonly roles?: string[],
        public readonly apprentices?: Number[],
        public readonly artists?: [number,number][],
        public readonly estado?: string,
    ) {}

    static create(body: any): UpdateApplicationDto {
        if (!body.groupName) {
            throw new Error("Missing required fields");
        }
        if(!body.roles ){
            throw new Error("Missing required fields");
        }
        return new UpdateApplicationDto(body.groupName,body.roles,body.apprentices,body.artists,body.estado)
    }
}
