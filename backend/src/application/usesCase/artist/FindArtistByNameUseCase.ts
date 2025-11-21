import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";

@injectable()
export class FindArtistByNameUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

  async execute(name: string): Promise<ArtistResponseDto[]> {
    if (!name || name.trim().length === 0) {
      throw new Error("Artist name is required");
    }

    const artists = await this.artistRepository.findByName(name);
    return  ArtistResponseDto.fromEntities(artists);
  }
}