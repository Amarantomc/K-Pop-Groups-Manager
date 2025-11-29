import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import  { CreateApprenticeUseCase } from "../../application/usesCase/apprentice/CreateApprentice";
import  { GetApprenticeUseCase } from "../../application/usesCase/apprentice/GetApprenticeUseCase";
import  { GetApprenticeByNameUseCase } from "../../application/usesCase/apprentice/GetApprenticeByNameUseCase";
import  { DeleteApprenticeUseCase } from "../../application/usesCase/apprentice/DeleteApprentice";
import  { UpdateApprenticeUseCase } from "../../application/usesCase/apprentice/UpdateApprentice";
import { CreateApprenticeDto } from "../../application/dtos/apprentice/CreateApprenticeDto";
import type { Request,Response } from "express";
import type { ListApprenticeUseCase } from "../../application/usesCase/apprentice/ListApprenticeUseCase";
import type { ListByAgencyUseCase } from "../../application/usesCase/apprentice/ListByAgencyUseCase";


@injectable()
export class ApprenticeController {
    
constructor(@inject(Types.CreateApprenticeUseCase)  private createApprenticeUseCase: CreateApprenticeUseCase ,
            @inject(Types.GetApprenticeUseCase) private getApprenticeUseCase:GetApprenticeUseCase,
            @inject(Types.DeleteApprenticeUseCase) private deleteApprenticeUseCase:DeleteApprenticeUseCase,
            @inject(Types.UpdateApprenticeUseCase) private updateApprenticeUseCase:UpdateApprenticeUseCase,
            @inject(Types.ListApprenticeUseCase) private listApprenticeUseCase:ListApprenticeUseCase,
             @inject(Types.ListByAgencyUseCase) private listByAgencyUseCase: ListByAgencyUseCase){}
            @inject(Types.GetApprenticeByNameUseCase) private getByNameApprenticeUseCase:GetApprenticeByNameUseCase,
          ){}

    
  async createApprentice(req: Request, res: Response) 
      {
    try {
      
      const {id} =req.params
      
      const apprenticeDto=CreateApprenticeDto.create(req.body,Number(id));
      const apprentice = await this.createApprenticeUseCase.execute(apprenticeDto);

      

      res.status(201).json({
        success: true,
        data: apprentice
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
      }

      async getByNameApprentice(req: Request, res: Response) 
      {
        try {
              const { name } = req.params;
              const apprentice = await this.getByNameApprenticeUseCase.excute(name!);
               
               

              res.json({
                success: true,
                data: apprentice
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

    async getApprentice(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const apprentice = await this.getApprenticeUseCase.excute(id!);
               
               

              res.json({
                success: true,
                data: apprentice
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

    async deleteApprentice(req: Request, res: Response) {
    try {
      
        const { id } = req.params;
        const apprentice = await this.deleteApprenticeUseCase.execute(id!)
      

      res.json({
        success: true,
        data: apprentice
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

       async updateApprentice(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const apprentice = await this.updateApprenticeUseCase.execute(id!,req.body)
               
               

              res.json({
                success: true,
                data: apprentice
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

      async listApprentice(req: Request, res: Response) {
    try {
      
      const apprentice = await this.listApprenticeUseCase.execute()
      

      res.json({
        success: true,
        data: apprentice
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

      async listByAgency(req: Request, res: Response) {
    try {
      
      const { id } = req.params;
      
      const apprentices = await this.listByAgencyUseCase.execute(Number(id));
      

      res.json({
        success: true,
        data: apprentices
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}