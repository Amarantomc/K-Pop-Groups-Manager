import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";

@injectable()
export class GetAlbumUseCase{
    constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository){}

    async excute(albumId:string): Promise<AlbumResponseDto> {

            const album = await this.albumRepository.findById(albumId);
            if(!album)
            {
                throw new Error('Album not found');
            }

         return AlbumResponseDto.fromEntity(album)
        
    }
}