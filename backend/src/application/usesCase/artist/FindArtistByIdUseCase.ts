import { inject, injectable } from "inversify";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";
import { Types } from "../../../infrastructure/di/Types";

@injectable()
export class FindArtistByIdUseCase {

    constructor(@inject(Types.IArtistRepository) private artistRepository: IArtistRepository){}

    async execute(Id: string): Promise<ArtistResponseDto> {
        const artist = await this.artistRepository.findById(Id);
        if (!artist) {
          throw new Error('Artist not found');
        }
         
        return ArtistResponseDto.fromEntity(artist)
      }
    
}