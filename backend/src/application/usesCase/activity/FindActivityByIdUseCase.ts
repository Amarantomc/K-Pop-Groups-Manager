// FindActivityByIdUseCase.ts
import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";

@injectable()
export class FindActivityByIdUseCase {
  constructor(
    @inject(Types.IActivityRepository) private activityRepository: IActivityRepository
  ) {}

  async execute(id: string): Promise<ActivityResponseDto> {
    const activity = await this.activityRepository.findById(id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    return ActivityResponseDto.fromEntity(activity);
  }
}