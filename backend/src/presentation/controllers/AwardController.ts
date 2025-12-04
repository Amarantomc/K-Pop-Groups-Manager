import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request,Response } from "express";
import type { CreateAwardUseCase } from "../../application/usesCase/award/CreateAwardUseCase";
import type { GetAwardUseCase } from "../../application/usesCase/award/GetAwardUseCase";
import type { DeleteAwardUseCase } from "../../application/usesCase/award/DeleteAwardUseCase";
import type { UpdateAwardUseCase } from "../../application/usesCase/award/UpdateAwardUseCase";
import type { ListAwardUseCase } from "../../application/usesCase/award/ListAwardUseCase";
import { CreateAwardDto } from "../../application/dtos/award/CreateAwardDto";
import { UpdateAwardDto } from '../../application/dtos/award/UpdateAwardDto';


@injectable()
export class AwardController {
    
constructor(@inject(Types.CreateAwardUseCase)  private createAwardUseCase: CreateAwardUseCase ,
            @inject(Types.GetAwardUseCase) private getAwardUseCase:GetAwardUseCase,
            @inject(Types.DeleteAwardUseCase) private deleteAwardUseCase:DeleteAwardUseCase,
            @inject(Types.UpdateAwardUseCase) private updateAwardUseCase:UpdateAwardUseCase,
            @inject(Types.ListAwardUseCase) private listAwardUseCase:ListAwardUseCase){}

    
  async createAward(req: Request, res: Response) 
      {
    try {
          
      const awardDto=CreateAwardDto.create(req.body)
      const award = await this.createAwardUseCase.execute(awardDto);

      

      res.status(201).json({
        success: true,
        data: award
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
      }

    async getAward(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const award = await this.getAwardUseCase.excute(id!);
               
               

              res.json({
                success: true,
                data: award
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

    async deleteAward(req: Request, res: Response) {
    try {
      
        const { id } = req.params;
        const award = await this.deleteAwardUseCase.execute(id!)
      

      res.json({
        success: true,
        data: award
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

       async updateAward(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const award = await this.updateAwardUseCase.execute(id!,req.body)
               
               

              res.json({
                success: true,
                data: award
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

      async listAward(req: Request, res: Response) {
    try {
      
      const award = await this.listAwardUseCase.execute()
      

      res.json({
        success: true,
        data: award
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}