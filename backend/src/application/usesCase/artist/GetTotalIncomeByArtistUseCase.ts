import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { RequestArtistWithIncomeDto } from "../../dtos/artist/RequestArtistWithIncomeDto";
import type { ArtistWithIncomeDto } from "../../dtos/artist/ArtistWithIncomeDto";

@injectable()
export class GetTotalIncomeByArtistUseCase {
    constructor(
          @inject(Types.IArtistRepository)private artistRepository:IArtistRepository
    ){}

    async execute(data:RequestArtistWithIncomeDto):Promise<ArtistWithIncomeDto>{
        try {
             const id={apprenticeId:data.apprenticeId,groupId:data.groupId} as any
            const artist= await this.artistRepository.findById(id)
            if(!artist){
                throw new Error("Artist not found")
            }
             
            let individualIncome= await this.artistRepository.getIndividualIncome(data)
            const groupsIncome= await this.artistRepository.getIncomeGeneratedInGroups(data)
            if(!individualIncome && !groupsIncome){
                throw new Error("Artist not have incomes yet")
            }
            if(!individualIncome){
                return groupsIncome!
            }
            if(!groupsIncome){
                return individualIncome!
            }
            individualIncome!.TotalIncome+=groupsIncome!.TotalIncome
            return individualIncome!
            
        } catch (error) {
             console.log(error)
            throw error
        }
    }
}