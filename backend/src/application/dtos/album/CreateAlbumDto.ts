export class CreateAlbumDto {
    constructor(
        public readonly apprenticeId:number,
        public readonly groupId: number,
        public readonly title: string,
        public readonly releaseDate: Date | string,
        public readonly producer: string,
 
    ) {}

    static create(body: any): CreateAlbumDto {

        if (!body.title || !body.releaseDate || !body.producer  || !body.apprenticeId||!body.groupId) {
            throw new Error("Missing required fields");
        }
 

        return new CreateAlbumDto(
            body.apprenticeId,
            body.groupId,
            body.title,
            body.releaseDate,
            body.producer,
        
          
            
        );
    }
}