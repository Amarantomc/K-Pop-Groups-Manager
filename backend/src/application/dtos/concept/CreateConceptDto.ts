
export class CreateConceptDto{
    constructor(
        public readonly name:string,
        public readonly description:string
    ){}

    static create(body:any):CreateConceptDto{

        if(!body.name || !body.description){
            throw new Error('Missing required fields');
        }
        return new CreateConceptDto(body.name,body.description)
    }
}