import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { CreateContractUseCase } from "../../application/usesCase/contract/CreateContractUseCase";
import type { Request, Response } from "express";
import { CreateContractDto } from "../../application/dtos/contract/CreateContractDto";

@injectable()
export class ContractController{
    constructor(@inject(Types.CreateContractUseCase) private createContractUseCase:CreateContractUseCase){}

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
}