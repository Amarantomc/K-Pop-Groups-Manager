import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";

@injectable()
export class GetReleasesUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

  async execute(
    artistId: number,
    groupId: number
  ): Promise<
    Array<{
      albumId: number;
      visualConceptId: number;
    }>
  > {
    const releases = await this.artistRepository.getReleases(artistId, groupId);

    if (releases.length === 0) {
      throw new Error("No releases found for this artist");
    }

    return releases;
  }
}