// UpdateActivityUseCase.ts
import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { UpdateActivityDto } from "../../dtos/activity/UpdateActivityDto";
import { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";

@injectable()
export class UpdateActivityUseCase {
  constructor(
    @inject(Types.IActivityRepository) private activityRepository: IActivityRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, data: Partial<UpdateActivityDto>): Promise<ActivityResponseDto> {
    try {
      await this.unitOfWork.beginTransaction();

      const existingActivity = await this.activityRepository.findById(id);
      if (!existingActivity) {
        throw new Error("Activity not found");
      }

      const activity = await this.activityRepository.update(id, data);

      await this.unitOfWork.commit();
      return ActivityResponseDto.fromEntity(activity);
    } catch (error) {
       
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}