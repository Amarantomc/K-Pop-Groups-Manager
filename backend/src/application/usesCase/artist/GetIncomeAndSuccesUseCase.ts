import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { ArtistWithIncomeDto } from "../../dtos/artist/ArtistWithIncomeDto";
import type { RequestArtistWithIncomeDto } from "../../dtos/artist/RequestArtistWithIncomeDto";
import type { ArtistWithSuccesDto } from "../../dtos/artist/ArtistWithSuccesDto";
import type { GetTotalIncomeByArtistUseCase } from "./GetTotalIncomeByArtistUseCase";
import type { GetBestAlbumsUseCase } from "./GetBestAlbumsUseCase";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class GetIncomeAndSuccesUseCase{
    constructor(@inject(Types.IGroupRepository)private groupRepository:IGroupRepository,
                @inject(Types.GetTotalIncomeByArtistUseCase)private totalIncome:GetTotalIncomeByArtistUseCase,
                 @inject(Types.GetBestAlbumsUseCase)private getBestAlbums:GetBestAlbumsUseCase,
                @inject(Types.IAlbumRepository)private albumRepository:IAlbumRepository){}

    async execute(data:RequestArtistWithIncomeDto):Promise<{incomes:ArtistWithIncomeDto,succes:ArtistWithSuccesDto[],lastWorks:AlbumResponseDto[]}>{
            try {
                  const income= await this.totalIncome.execute(data)
                  const albums= await this.getBestAlbums.execute(data)
                  const groupHistory = await this.groupRepository.getLastGroup(data.apprenticeId,data.groupId)
                  const groupAlbums = await this.albumRepository.getByGroup(groupHistory.id)
                   
                  const responseAlbum= AlbumResponseDto.fromEntities(groupAlbums!)


                  
                  return{incomes:income,succes:albums,lastWorks:responseAlbum}

            } catch (error) {
                throw error
            }
    }
}