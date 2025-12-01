import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";

@injectable()
export class FindActivitiesByArtist{

    constructor(@inject(Types.IActivityRepository) private activityRepository:IActivityRepository,
                    @inject(Types.IArtistRepository)private artistRepository:IArtistRepository){}

    async execute(id:any):Promise<ActivityResponseDto[]>{

       try {
          //Verificar que el Artista exista
        
     const artist= await this.artistRepository.findById(id!)
        if(!artist){
            throw new Error ("Artist Not Found")
        }
    
    const activities= await this.activityRepository.findByArtist(id.apprenticeId,id.groupId)
return ActivityResponseDto.fromEntities(activities)
       } catch (error) {
         throw error;
       }
       
       
    }
}