import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";

@injectable()
export class AcceptOrRejectActivityUseCase {
  constructor(
    @inject(Types.IActivityRepository)
    private activityRepository: IActivityRepository
  ) {}

  async execute(activityId: number, isAccepted: boolean): Promise<void> {
    if (!activityId) {
      throw new Error("Activity id is required");
    }

    await this.activityRepository.acceptedActivity(activityId, isAccepted);
  }
}