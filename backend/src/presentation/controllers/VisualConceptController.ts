import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request,Response } from "express";
import VisualConcept from '../../domain/entities/VisualConcept';
import type { CreateVisualConceptUseCase } from "../../application/usesCase/visualConcept/CreateVisualConceptUseCase";
import type { GetVisualConceptUseCase } from "../../application/usesCase/visualConcept/GetConceptUseCase";
import type { DeleteVisualConceptUseCase } from "../../application/usesCase/visualConcept/DeleteVisualConceptUseCase";
import type { UpdateVisualConceptUseCase } from "../../application/usesCase/visualConcept/UpdateVisualConceptUseCase";
import type { ListVisualConceptUseCase } from "../../application/usesCase/visualConcept/ListVisualConceptUseCase";
import { CreateVisualConceptDto } from "../../application/dtos/visualConcept/CreateVisualConceptDto";


@injectable()
export class VisualConceptController {
    
constructor(@inject(Types.CreateVisualConceptUseCase)  private createVisualConceptUseCase: CreateVisualConceptUseCase ,
            @inject(Types.GetVisualConceptUseCase) private getVisualConceptUseCase:GetVisualConceptUseCase,
            @inject(Types.DeleteVisualConceptUseCase) private deleteVisualConceptUseCase:DeleteVisualConceptUseCase,
            @inject(Types.UpdateVisualConceptUseCase) private updateVisualConceptUseCase:UpdateVisualConceptUseCase,
            @inject(Types.ListVisualConceptUseCase) private listVisualConceptUseCase:ListVisualConceptUseCase){}

    
  async createVisualConcept(req: Request, res: Response) 
      {
    try {
          
      const VisualConceptDto=CreateVisualConceptDto.create(req.body)
      const VisualConcept = await this.createVisualConceptUseCase.execute(VisualConceptDto);

      

      res.status(201).json({
        success: true,
        data: VisualConcept
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
      }

    async getVisualConcept(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const VisualConcept = await this.getVisualConceptUseCase.excute(id!);
               
               

              res.json({
                success: true,
                data: VisualConcept
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

    async deleteVisualConcept(req: Request, res: Response) {
    try {
      
        const { id } = req.params;
        const VisualConcept = await this.deleteVisualConceptUseCase.execute(id!)
      

      res.json({
        success: true,
        data: VisualConcept
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

       async updateVisualConcept(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const VisualConcept = await this.updateVisualConceptUseCase.execute(id!,req.body)
               
               

              res.json({
                success: true,
                data: VisualConcept
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

      async listVisualConcept(req: Request, res: Response) {
    try {
      
      const VisualConcept = await this.listVisualConceptUseCase.execute()
      

      res.json({
        success: true,
        data: VisualConcept
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}