import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";

@injectable()
export class GetGroupHistoryUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository
  ) {}

  async execute(
    artistId: number,
    groupId: number
  ): Promise<
    Array<{
      groupId: number;
      role: string;
      startDate: Date;
      endDate?: Date;
    }>
  > {
    const history = await this.artistRepository.getGroupHistory(
      artistId,
      groupId
    );

    if (history.length === 0) {
      throw new Error("No group history found for this artist");
    }

    return history;
  }
}