 import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
 import { inject, injectable } from "inversify";
 import { Types } from "../../../infrastructure/di/Types";
// import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
// import type { CreateAlbumDto } from "../../dtos/album/CreateAlbumDto";
// import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";
import type { CreateAlbumDto } from "../../dtos/album/CreateAlbumDto";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";


// @injectable()
// export class CreateAlbumUseCase{

//     constructor(
//     @inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository,
//     @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
//   ) {}

//     async execute(command:CreateAlbumDto):Promise<AlbumResponseDto>{
//         try
//         {
         
//             await this.unitOfWork.beginTransaction();
//             const album = await this.albumRepository.create(command);
//             console.log(album);
//             await this.unitOfWork.commit();
            
//             return new AlbumResponseDto(
//                 album.id,
//                 album.idGroup,
//                 album.title,  
//                 album.releaseDate,      
//                 album.producer,           
//                 //album.noSongs,       
//                 album.noCopiesSold,
//                 !album.songs? [] : album.songs,
//                 album.artists,
//                 album.awards,
//               );
//         }
//         catch(error){
//             //console.log(error);
//             await this.unitOfWork.rollback();
//             throw error;
//         }
//       }
// }

@injectable()
export class CreateAlbumUseCase {

    constructor(
        @inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository,
        @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
    ) {}

    async execute(command: CreateAlbumDto): Promise<AlbumResponseDto> {
        try {
            await this.unitOfWork.beginTransaction();

            const album = await this.albumRepository.create(command);

            await this.unitOfWork.commit();

            // 🔥🔥 Construcción CORRECTA del DTO
            return new AlbumResponseDto(
                album.id,                     // <-- OK
                
                album.idGroup,                // OJO: idGroup NO existe en prisma
                album.title,                // title NO existe en prisma
                album.releaseDate,       // releaseDate tampoco
                album.producer,              // OK
                album.noSongs,            // <-- LO TENÍAS COMENTADO
                album.noCopiesSold,       // OK

                album.songs ?? [],        // songs
                album.artists?? [],         // artists
                album.awards ?? [],
                album.groups             // awards
            );

        } catch (error) {
          console.log(error);
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}