export default class CreateSongInAlbumDTO{
    constructor(
        public readonly songId:number,
        public readonly albumId:number,
    ){}

    static create(body:any): CreateSongInAlbumDTO{

        if(!body. || !body.year){
            throw new Error('Missing required fields');
        }

        return new CreateSongInAlbumDTO(body.songId,body.albumId)
    }
}