import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { RequestArtistWithIncomeDto } from "../../dtos/artist/RequestArtistWithIncomeDto";
import type { ArtistWithSuccesDto } from "../../dtos/artist/ArtistWithSuccesDto";

@injectable()
export class GetBestAlbumsUseCase{
    constructor(@inject(Types.IArtistRepository)private artistRepository:IArtistRepository){}

    async execute(data:RequestArtistWithIncomeDto):Promise<ArtistWithSuccesDto[]>{
        try {
            
            const id:any={apprenticeId:data.apprenticeId,groupId:data.groupId} 
            const artist= await this.artistRepository.findById(id)
            if(!artist){
                throw new Error("Artist not Found")
            }
            const albums= await this.artistRepository.getBestAlbums(data)
            if(!albums){
                throw new Error("Artist does not have Solo Albums")
            }
            
            return albums
        } catch (error) {
            throw error
        }
    }
}