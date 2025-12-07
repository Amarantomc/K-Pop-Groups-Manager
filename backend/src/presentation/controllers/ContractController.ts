import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { CreateContractUseCase } from "../../application/usesCase/contract/CreateContractUseCase";
import type { Request, Response } from "express";
import { CreateContractDto } from "../../application/dtos/contract/CreateContractDto";
import type { UpdateContractUseCase } from "../../application/usesCase/contract/UpdateContractUseCase";
import type { DeleteContractUseCase } from "../../application/usesCase/contract/DeleteContractUseCase";
import type { FindContractByIdUseCase } from "../../application/usesCase/contract/FindContractByIdUseCase";
import type { GetAllContractUseCase } from "../../application/usesCase/contract/GetAllContractUseCase";

@injectable()
export class ContractController{
    constructor(@inject(Types.CreateContractUseCase) private createContractUseCase:CreateContractUseCase,
                @inject(Types.DeleteContractUseCase) private deleteContractUseCase: DeleteContractUseCase,
                 @inject(Types.UpdateContractUseCase) private updateContractUseCase: UpdateContractUseCase,
                 @inject(Types.FindContractByIdUseCase) private findContractByIdUseCase: FindContractByIdUseCase,
                  @inject(Types.GetAllContractsUseCase) private getAllContractsUseCase:GetAllContractUseCase){}

    async createContract(req:Request,res:Response){
        try {
            const dto=CreateContractDto.Create(req.body)
            const contract=await this.createContractUseCase.execute(dto)
             res.status(201).json({
        success: true,
        data: contract
      });
            
        } catch (error:any) {
            res.status(400).json({
        success: false,
        error: error.message
        })
    }
    }

         async delete(req:Request,res:Response){
        try {
              const {id,agencyId,groupId,apprenticeId,startDate}=req.query
              const newId={id:id,agencyId:agencyId,groupId:groupId,apprenticeId:apprenticeId,startDate:startDate}
              await this.deleteContractUseCase.execute(newId)
             res.status(201).json({
        success: true,
        data: "Contract deleted successfully"
      });
            
        } catch (error:any) {
            res.status(400).json({
        success: false,
        error: error.message
        })
    }
    }

        async getAll(req:Request,res:Response){
        try {
              
            const contracts=  await this.getAllContractsUseCase.execute()
             res.status(201).json({
        success: true,
        data: contracts
      });
            
        } catch (error:any) {
            res.status(400).json({
        success: false,
        error: error.message
        })
    }
    }

        async findById(req:Request,res:Response){
        try {
              const {id,agencyId,groupId,apprenticeId,startDate}=req.query
              const newId={id:id,agencyId:agencyId,groupId:groupId,apprenticeId:apprenticeId,startDate:startDate}
              
            const contract=  await this.findContractByIdUseCase.execute(newId)
             res.status(201).json({
        success: true,
        data: contract
      });
            
        } catch (error:any) {
            res.status(400).json({
        success: false,
        error: error.message
        })
    }
    }  
      
        async update(req:Request,res:Response){
        try {
              const {id,agencyId,groupId,apprenticeId,startDate}=req.query
              const newId={id:id,agencyId:agencyId,groupId:groupId,apprenticeId:apprenticeId,startDate:startDate}
            const contract=  await this.updateContractUseCase.execute(newId,req.body)
             res.status(201).json({
        success: true,
        data: contract
      });
            
        } catch (error:any) {
            res.status(400).json({
        success: false,
        error: error.message
        })
    }
    }
}