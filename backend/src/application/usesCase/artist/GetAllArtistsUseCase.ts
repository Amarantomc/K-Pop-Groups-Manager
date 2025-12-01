import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";

@injectable()
export class GetAllArtistsUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

  async execute(): Promise<ArtistResponseDto[]> {
    const artists = await this.artistRepository.getAll();
    return ArtistResponseDto.fromEntities(artists)
  }
}