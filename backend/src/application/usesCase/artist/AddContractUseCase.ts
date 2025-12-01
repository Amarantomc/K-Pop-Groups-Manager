import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class AddContractUseCase {
  constructor(
    @inject(Types.IArtistRepository)
    private artistRepository: IArtistRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: {
    artistId: number;
    groupId: number;
    agencyId: number;
    startDate: Date;
    endDate?: Date;
    status?: string;
    initialConditions?: string;
    incomeDistribution?: string;
  }): Promise<void> {
    try {
      await this.unitOfWork.beginTransaction();

      if (command.agencyId <= 0) {
        throw new Error("Invalid agency ID");
      }

      if (command.startDate > new Date()) {
        throw new Error("Start date cannot be in the future");
      }

      if (command.endDate && command.endDate < command.startDate) {
        throw new Error("End date must be after start date");
      }

      await this.artistRepository.addContract(
        command.artistId,
        command.groupId,
        command.agencyId,
        command.startDate,
        command.endDate,
        command.status || "ACTIVE",
        command.initialConditions,
        command.incomeDistribution
      );

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}