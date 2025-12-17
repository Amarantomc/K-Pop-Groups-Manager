import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";

@injectable()
export class ArtistsWithActiveContractsUseCase {
  constructor( 
    @inject(Types.IAgencyRepository)private readonly agencyRepository: IAgencyRepository
  ) {}

  async execute(agencyId: number, date: Date | string
  ) {
    const artists = await this.agencyRepository.artistsWithActiveContracts(agencyId,date);

    return ArtistResponseDto.fromEntities(artists);
  }
}