 import { inject, injectable } from "inversify";
 import { Types } from "../../../infrastructure/di/Types";
// import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
// import type { UpdateAlbumDto } from "../../dtos/album/UpdateAlbumDto";
// import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";
import type { UpdateAlbumDto } from "../../dtos/album/UpdateAlbumDto";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";

// @injectable()
// export class UpdateAlbumUseCase {
//   constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository) {}

//   async execute(
//     albumId: string,
//     data: Partial<UpdateAlbumDto>
//   ): Promise<AlbumResponseDto> {

//     const album = await this.albumRepository.findById(albumId);

//     if (!album) {
//       throw new Error("Album not found");
//     }

//     const updatedAlbum = await this.albumRepository.update(albumId, data);

//     return new AlbumResponseDto(
//         album.id,
//         album.idGroup,
//         album.title,  
//         album.releaseDate,      
//         album.producer,           
//         album.noSongs,       
//         album.noCopiesSold,
//         !album.songs? [] : album.songs,
//         album.artists,
//         album.awards,
//       );
      
//   }
// }

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

    const updated = await this.albumRepository.update(albumId, data);

    return new AlbumResponseDto(
      updated.id,
      updated.idGroup,
      updated.title,  
      updated.releaseDate,      
      updated.producer,           
      updated.noSongs,       
      updated.noCopiesSold,
      updated.songs ?? [],
      updated.artists,
      updated.awards,
      updated.groups
    );
  }
}