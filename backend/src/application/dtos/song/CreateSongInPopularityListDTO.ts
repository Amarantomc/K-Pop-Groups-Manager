export default class CreateSongInPopularityListDTO{
    constructor(
        public readonly position:number,
        public readonly year:number,
    ){}

    static create(body:any): CreateSongInPopularityListDTO{

        if(!body.position || !body.year){
            throw new Error('Missing required fields');
        }

        return new CreateSongInPopularityListDTO(body.position,body.year)
    }
}