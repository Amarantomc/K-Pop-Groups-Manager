import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import type { UpdateAlbumDto } from "../../dtos/album/UpdateAlbumDto";
import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class UpdateAlbumUseCase {
  constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository) {}

  async execute(
    albumId: string,
    data: Partial<UpdateAlbumDto>
  ): Promise<AlbumResponseDto> {

    const album = await this.albumRepository.findById(albumId);

    if (!album) {
      throw new Error("Album not found");
    }

    const updatedAlbum = await this.albumRepository.update(albumId, data);

    return new AlbumResponseDto(
        album.id,
        album.idGroup,
        album.title,  
        album.releaseDate,      
        album.producer,           
        album.noSongs,       
        album.noCopiesSold,
        !album.songs? [] : album.songs,
        album.artists,
        album.awards,
      );
      
  }
}