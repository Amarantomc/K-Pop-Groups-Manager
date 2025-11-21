import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";
import { ArtistStatus } from "../../../domain/enums/ArtistStatus";

@injectable()
export class FindArtistByStatusUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

  async execute(status: string): Promise<ArtistResponseDto[]> {
    if (!status || status.trim().length === 0|| !(status in ArtistStatus)) {
      throw new Error("Status is required");
    }

    const artists = await this.artistRepository.findByStatus(status);
    return  ArtistResponseDto.fromEntities(artists);
  }
}