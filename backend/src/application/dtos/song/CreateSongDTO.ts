export default class CreateSongDTO{
    constructor(
        public readonly title:string,
        public readonly releaseDate:Date|string,
        public readonly producer:string,
        public readonly gender:string,
    ){}

    static create(body:any): CreateSongDTO{

        if(!body.title || !body.releaseDate || !body.producer || !body.gender){
            throw new Error('Missing required fields');
        }

        if (body.releaseDate instanceof Date && body.releaseDate < new Date()) {
            throw new Error('Invalid Release Date');
        }
        else if (body.releaseDate === 'string'){
            let releaseDate = new Date(body.releaseDate);
            if(releaseDate < new Date()){
                 throw new Error('Invalid Release Date');
            }
        }

        return new CreateSongDTO(body.title,body.releaseDate,body.producer,body.gender)
    }
}