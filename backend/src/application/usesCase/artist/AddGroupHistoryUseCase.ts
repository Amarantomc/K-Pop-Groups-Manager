import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class AddGroupHistoryUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  
  async execute(command: {
    artistId: number;
    groupId: number;
    debutGroupId: number;
    role: string;
    startDate: Date;
  }): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      if (!command.role || command.role.trim().length === 0) {
        throw new Error("Role is required");
      }

      if (command.startDate > new Date()) {
        throw new Error("Start date cannot be in the future");
      }

      await this.artistRepository.addGroupHistory(
        command.artistId,
        command.groupId,
        command.debutGroupId,
        command.role,
        command.startDate
      );

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}