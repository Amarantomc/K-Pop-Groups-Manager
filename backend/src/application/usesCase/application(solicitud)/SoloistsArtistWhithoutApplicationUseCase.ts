import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";

@injectable()
export class SoloistsArtistWhithoutApplicationUseCase {
  constructor(
    @inject(Types.IApplicationRepository)
    private applicationRepository: IApplicationRepository
  ) {}

  async execute(): Promise<ArtistResponseDto[] | null> {
    const artists = await this.applicationRepository.soloistsArtistWhithoutApplication();

    if (!artists || artists.length === 0) {
      return null;
    }

    return ArtistResponseDto.fromEntities(artists);
  }
}