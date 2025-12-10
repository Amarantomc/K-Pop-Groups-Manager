
export class UpdateAlbumDto {
    constructor(
        public readonly groupName?: string,
        public readonly producer?: string,
        public readonly noCopiesSold?: number,
    ) {}

    static create(body: any): UpdateAlbumDto {

        return new UpdateAlbumDto(body.groupName,body.producer,body.noCopiesSold)
    }
}
