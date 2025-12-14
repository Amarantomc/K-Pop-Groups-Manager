import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
 
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";
import { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";

@injectable()
export class GetArtistsWhoChangeAgencyUseCase{
     constructor(@inject(Types.IArtistRepository) private artistRepository:IArtistRepository){}

     async execute():Promise<ArtistResponseDto[]>{
         const artists= await this.artistRepository.getWhoChangeAgencyAndGroup()
         if(!artists){
            throw new Error("No artists with agency change")
         }
         const artistsDto=ArtistResponseDto.fromEntities(artists)
         const artistsWithActivities = await Promise.all(
             artistsDto.map(async (artist) => {
                 
                 let activities = await this.artistRepository.getActivities(
                     artist.ApprenticeId, 
                     artist.GroupId
                 );
                 
                 let contracts= await this.artistRepository.getContracts(
                    artist.ApprenticeId,
                    artist.GroupId
                 )
                 
                 return {
                     ...artist,
                     activities: activities,
                     contracts:contracts
                 };
             })
         );
         return artistsDto
     }
}