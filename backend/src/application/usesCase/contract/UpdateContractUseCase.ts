import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { UnitOfWork } from "../../../infrastructure/PrismaUnitOfWork";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import { ContractResponseDto } from "../../dtos/contract/ContractResponseDto";
import type { CreateContractDto } from "../../dtos/contract/CreateContractDto";

@injectable()
export class  UpdateContractUseCase {
   constructor( @inject(Types.IContractRepository) private contractRepository:IContractRepository,
                @inject(Types.IUnitOfWork) private unitOfWork:UnitOfWork
            ){}

    async execute(id:any,data:Partial<CreateContractDto>):Promise<ContractResponseDto>{
        
        try { 
              await this.unitOfWork.beginTransaction()
            let contract = await this.contractRepository.findById(id);
            if(!contract){
                throw new Error('Contract not found');
            }
             
             contract =await this.contractRepository.update(id,data);
            await this.unitOfWork.commit();
            return ContractResponseDto.fromEntity(contract);
        
        } catch (error) {
            
            await this.unitOfWork.rollback();
            throw error
        }
        
    }
}