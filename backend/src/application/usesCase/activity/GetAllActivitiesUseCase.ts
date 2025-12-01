// GetAllActivitiesUseCase.ts
import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";

@injectable()
export class GetAllActivitiesUseCase {
  constructor(
    @inject(Types.IActivityRepository) private activityRepository: IActivityRepository
  ) {}

  async execute(): Promise<ActivityResponseDto[]> {
    const activities = await this.activityRepository.getAll();
    return ActivityResponseDto.fromEntities(activities);
  }
}