import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { UnitOfWork } from "../../../infrastructure/PrismaUnitOfWork";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";

@injectable()
export class GroupOfferContractUseCase {
  constructor(
    @inject(Types.IContractRepository)private readonly contractRepository: IContractRepository,
    @inject(Types.IUnitOfWork)private readonly unitOfWork: UnitOfWork
  ) {}

  async execute(): Promise<GroupResponseDTO[]> {
    try {
      await this.unitOfWork.beginTransaction();

      const groups= await this.contractRepository.groupsOfferContract();

      await this.unitOfWork.commit();

      return GroupResponseDTO.fromEntities(groups);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}