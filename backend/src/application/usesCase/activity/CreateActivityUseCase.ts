// CreateActivityUseCase.ts
import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { CreateActivityDto } from "../../dtos/activity/CreateActivityDto";
import { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";

@injectable()
export class CreateActivityUseCase {
  constructor(
    @inject(Types.IActivityRepository) private activityRepository: IActivityRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: CreateActivityDto): Promise<ActivityResponseDto> {
    try {
      await this.unitOfWork.beginTransaction();

      const activity = await this.activityRepository.create(command);

      await this.unitOfWork.commit();
      return ActivityResponseDto.fromEntity(activity);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}