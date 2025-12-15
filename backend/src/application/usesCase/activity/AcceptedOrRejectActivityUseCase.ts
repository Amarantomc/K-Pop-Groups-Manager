import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";

@injectable()
export class AcceptOrRejectActivityUseCase {
  constructor(
    @inject(Types.IActivityRepository)
    private activityRepository: IActivityRepository
  ) {}

  async execute(activityId: number, isAccepted: boolean,apprenticeId:number,groupId:number): Promise<void> {
    if (!activityId) {
      throw new Error("Activity id is required");
    }
    if(!apprenticeId || !groupId){
      throw new Error("Artist id is required");

    }

    await this.activityRepository.acceptedActivity(activityId, isAccepted,apprenticeId,groupId);
  }
}