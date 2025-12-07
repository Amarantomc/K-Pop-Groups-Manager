import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import { ContractResponseDto } from "../../dtos/contract/ContractResponseDto";

@injectable()
export class GetAllContractUseCase {
   constructor( @inject(Types.IContractRepository) private contractRepository:IContractRepository
            ){}

    async execute():Promise<ContractResponseDto[]>{
        try {
            const contracts = await this.contractRepository.findAll();
        return ContractResponseDto.fromEntities(contracts);
        } catch (error) {
            throw error
        }
    
    }
}