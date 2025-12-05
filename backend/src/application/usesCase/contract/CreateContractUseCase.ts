import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { CreateContractDto } from "../../dtos/contract/CreateContractDto";
import { ContractResponseDto } from "../../dtos/contract/ContractResponseDto";
import { ContractType } from "../../../domain/enums/ContractType";

@injectable()
export class CreateContractUseCase {
  constructor(
    @inject(Types.IContractRepository) private repositoy: IContractRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: CreateContractDto): Promise<ContractResponseDto> {
    try {
      await this.unitOfWork.beginTransaction();
    
      const contract = await this.repositoy.create(command)

      await this.unitOfWork.commit();
      return ContractResponseDto.fromEntity(contract);
    } catch (error) {
      console.log(error)
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}