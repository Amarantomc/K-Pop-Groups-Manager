import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import type { UnitOfWork } from "../../../infrastructure/PrismaUnitOfWork";


@injectable()
export class  DeleteContractUseCase {
   constructor( @inject(Types.IContractRepository) private contractRepository:IContractRepository,
                @inject(Types.IUnitOfWork) private unitOfWork:UnitOfWork
            ){}

    async execute(id:any):Promise<void>{
        
        try { 
              await this.unitOfWork.beginTransaction()
            const contract = await this.contractRepository.findById(id);
            if(!contract){
                throw new Error('Contract not found');
            }
            await this.contractRepository.delete(id);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error
        }
        
    }
}