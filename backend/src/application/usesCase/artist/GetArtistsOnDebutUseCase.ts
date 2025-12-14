import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { ArtistOnDebutResponseDto } from "../../dtos/artist/ArtistsOnDebutResponseDto";

@injectable()
export class GetArtistsOnDebutUseCase{
    constructor(@inject(Types.IArtistRepository) private artistRepository:IArtistRepository){}

    async execute(idAgency:number):Promise<ArtistOnDebutResponseDto[]|null>{
        try {
            const artists= await this.artistRepository.getArtistsOnDebut(idAgency)
            if(!artists){
                throw new Error("No Artists With more than one Debut or Active Contracts")
            }
            return artists
        } catch (error) {
            throw error
        }

}}