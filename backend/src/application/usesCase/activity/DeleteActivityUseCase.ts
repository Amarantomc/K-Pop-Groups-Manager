// DeleteActivityUseCase.ts
import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class DeleteActivityUseCase {
  constructor(
    @inject(Types.IActivityRepository) private activityRepository: IActivityRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      const activity = await this.activityRepository.findById(id);
      if (!activity) {
        throw new Error("Activity not found");
      }

      await this.activityRepository.delete(id);

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}