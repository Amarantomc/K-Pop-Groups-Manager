import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class AddActivityUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: {
    artistId: number;
    groupId: number;
    activityId: number;
    accepted: boolean;
  }): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      if (command.activityId <= 0) {
        throw new Error("Invalid activity ID");
      }

      await this.artistRepository.addActivity(
        command.artistId,
        command.groupId,
        command.activityId,
        command.accepted
      );

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}