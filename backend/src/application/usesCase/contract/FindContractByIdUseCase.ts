import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import { ContractResponseDto } from "../../dtos/contract/ContractResponseDto";

@injectable()
export class FindContractByIdUseCase {
   constructor( @inject(Types.IContractRepository) private contractRepository:IContractRepository
            ){}

    async execute(id:any):Promise<ContractResponseDto>{
        
        try {
            const contract = await this.contractRepository.findById(id);
            if(!contract){
                throw new Error('Contract not found');
            }
            return ContractResponseDto.fromEntity(contract);
        } catch (error) {
            throw error
        }
        
    }
}