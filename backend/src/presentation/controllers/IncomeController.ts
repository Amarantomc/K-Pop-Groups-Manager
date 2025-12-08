import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request,Response } from "express";
import type { CreateIncomeUseCase } from "../../application/usesCase/income/CreateIncomeUseCase";
import type { GetIncomeUseCase } from "../../application/usesCase/income/GetIncomeUseCase";
import type { DeleteIncomeUseCase } from "../../application/usesCase/income/DeleteIncomeUseCase";
import type { UpdateIncomeUseCase } from "../../application/usesCase/income/UpdateIncomeUseCase";
import type { ListIncomeUseCase } from "../../application/usesCase/income/ListIncomeUseCase";
import { CreateIncomeDto } from "../../application/dtos/income/CreateIncomeDto";


@injectable()
export class IncomeController {
    
constructor(@inject(Types.CreateIncomeUseCase)  private createIncomeUseCase: CreateIncomeUseCase ,
            @inject(Types.GetIncomeUseCase) private getIncomeUseCase:GetIncomeUseCase,
            @inject(Types.DeleteIncomeUseCase) private deleteIncomeUseCase:DeleteIncomeUseCase,
            @inject(Types.UpdateIncomeUseCase) private updateIncomeUseCase:UpdateIncomeUseCase,
            @inject(Types.ListIncomeUseCase) private listIncomeUseCase:ListIncomeUseCase){}

    
  async createIncome(req: Request, res: Response) 
      {
    try {
          
      const incomeDto=CreateIncomeDto.create(req.body)
      const income = await this.createIncomeUseCase.execute(incomeDto);

      

      res.status(201).json({
        success: true,
        data: income
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
      }

    async getIncome(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const income = await this.getIncomeUseCase.excute(id!);
               
               

              res.json({
                success: true,
                data: income
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

    async deleteIncome(req: Request, res: Response) {
    try {
      
        const { id } = req.params;
        const income = await this.deleteIncomeUseCase.execute(id!)
      

      res.json({
        success: true,
        data: income
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

       async updateIncome(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const income = await this.updateIncomeUseCase.execute(id!,req.body)
               
               

              res.json({
                success: true,
                data: income
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

      async listIncome(req: Request, res: Response) {
    try {
      
      const income = await this.listIncomeUseCase.execute()
      

      res.json({
        success: true,
        data: income
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}