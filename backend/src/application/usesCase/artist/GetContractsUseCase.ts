import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";

@injectable()
export class GetContractsUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

  async execute(
    artistId: number,
    groupId: number
  ): Promise<
    Array<{
      agencyId: number;
      startDate: Date;
      endDate?: Date;
      status: string;
    }>
  > {
    const contracts = await this.artistRepository.getContracts(
      artistId,
      groupId
    );

    if (contracts.length === 0) {
      throw new Error("No contracts found for this artist");
    }

    return contracts;
  }
}