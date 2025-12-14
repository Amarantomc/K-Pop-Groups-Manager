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
             
            let individualIncome= await this.artistRepository.getIndividualIncome(data)
            const groupsIncome= await this.artistRepository.getIncomeGeneratedInGroups(data)
             
            individualIncome.TotalIncome+=groupsIncome.TotalIncome
            return individualIncome
            
        } catch (error) {
             
            throw error
        }
    }
}