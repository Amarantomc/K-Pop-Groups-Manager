

export class CreateVisualConceptDto{
    constructor(
        public readonly picture:string,
    ){}

    static create(body: any): CreateVisualConceptDto{
        if(!body.picture)
        {
            throw new Error('Missing required fields');
        }
        return new CreateVisualConceptDto(body.picture);
    }
}