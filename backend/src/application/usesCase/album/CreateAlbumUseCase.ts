 import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
 import { inject, injectable } from "inversify";
 import { Types } from "../../../infrastructure/di/Types";
 import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";
import type { CreateAlbumDto } from "../../dtos/album/CreateAlbumDto";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
 

@injectable()
export class CreateAlbumUseCase {

    constructor(
        @inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository,
        @inject(Types.IArtistRepository)private artistRepository:IArtistRepository,
        @inject(Types.IGroupRepository) private groupRepository:IGroupRepository,
        @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
    ) {}

    async execute(command: CreateAlbumDto): Promise<AlbumResponseDto> {
        try {
            await this.unitOfWork.beginTransaction();
            const album = await this.albumRepository.create(command);
            
            const soloArtist= await this.artistRepository.getSoloArtists()
            const isSoloArtist= soloArtist? soloArtist.find(x=>x.ApprenticeId==command.apprenticeId && x.GroupId==command.groupId):false
            if(!isSoloArtist){
                const actualGroup= await this.groupRepository.getLastGroup(command.apprenticeId,command.groupId)
                await this.albumRepository.addGroupAlbum(actualGroup.id,album.id)
                
            }else{
                await this.albumRepository.addSoloArtistAlbum(isSoloArtist.ApprenticeId,isSoloArtist.GroupId,album.id)
            }
            await this.unitOfWork.commit();
            return AlbumResponseDto.fromEntity(album)

             

        } catch (error) {
          console.log(error);
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}