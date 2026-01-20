import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { UnitOfWork } from "../../../infrastructure/PrismaUnitOfWork";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import { ContractResponseDto } from "../../dtos/contract/ContractResponseDto";

@injectable()
export class UpdateContractStatusUseCase {
  constructor(
    @inject(Types.IContractRepository)
    private contractRepository: IContractRepository,

    @inject(Types.IUnitOfWork)
    private unitOfWork: UnitOfWork
  ) {}

  async execute(agencyId: number,groupId: number,apprenticeId: number | null,status: string): Promise<ContractResponseDto> {
    try {
      await this.unitOfWork.beginTransaction();

      const contract = await this.contractRepository.updateStatus(agencyId,groupId,apprenticeId,status);

      if (!contract) {
        throw new Error("Contract not found");
      }

      await this.unitOfWork.commit();

      return ContractResponseDto.fromEntity(contract);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}