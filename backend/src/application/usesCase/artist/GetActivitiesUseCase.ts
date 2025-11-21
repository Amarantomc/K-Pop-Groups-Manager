import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";

@injectable()
export class GetActivitiesUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

  async execute(
    artistId: number,
    groupId: number
  ): Promise<
    Array<{
      activityId: number;
      accepted: boolean;
    }>
  > {
    const activities = await this.artistRepository.getActivities(
      artistId,
      groupId
    );

    if (activities.length === 0) {
      throw new Error("No activities found for this artist");
    }

    return activities;
  }
}