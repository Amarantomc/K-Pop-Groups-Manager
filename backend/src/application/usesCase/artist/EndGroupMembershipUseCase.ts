import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class EndGroupMembershipUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: {
    artistId: number;
    groupId: number;
    debutGroupId: number;
    startDate: Date;
    endDate: Date;
  }): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      if (command.endDate <= command.startDate) {
        throw new Error("End date must be after start date");
      }

      if (command.endDate > new Date()) {
        throw new Error("End date cannot be in the future");
      }

      await this.artistRepository.endGroupMembership(
        command.artistId,
        command.groupId,
        command.debutGroupId,
        command.startDate,
        command.endDate
      );

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}