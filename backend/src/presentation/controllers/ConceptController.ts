import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request,Response } from "express";
import Concept from '../../domain/entities/Concept';
import type { CreateConceptUseCase } from "../../application/usesCase/concept/CreateConcept";
import type { GetConceptUseCase } from "../../application/usesCase/concept/GetConceptUseCase";
import type { DeleteConceptUseCase } from "../../application/usesCase/concept/DeleteConcept";
import type { UpdateConceptUseCase } from "../../application/usesCase/concept/UpdateConcept";
import type { ListConceptUseCase } from "../../application/usesCase/concept/ListConceptUSeCase";
import { CreateConceptDto } from "../../application/dtos/concept/CreateConceptDto";


@injectable()
export class ConceptController {
    
constructor(@inject(Types.CreateConceptUseCase)  private createConceptUseCase: CreateConceptUseCase ,
            @inject(Types.GetConceptUseCase) private getConceptUseCase:GetConceptUseCase,
            @inject(Types.DeleteConceptUseCase) private deleteConceptUseCase:DeleteConceptUseCase,
            @inject(Types.UpdateConceptUseCase) private updateConceptUseCase:UpdateConceptUseCase,
            @inject(Types.ListConceptUseCase) private listConceptUseCase:ListConceptUseCase){}

    
  async createConcept(req: Request, res: Response) 
      {
    try {
          
      const conceptDto=CreateConceptDto.create(req.body)
      const concept = await this.createConceptUseCase.execute(conceptDto);

      

      res.status(201).json({
        success: true,
        data: concept
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
      }

    async getConcept(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const concept = await this.getConceptUseCase.excute(id!);
               
               

              res.json({
                success: true,
                data: concept
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

    async deleteConcept(req: Request, res: Response) {
    try {
      
        const { id } = req.params;
        const concept = await this.deleteConceptUseCase.execute(id!)
      

      res.json({
        success: true,
        data: concept
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

       async updateConcept(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const concept = await this.updateConceptUseCase.execute(id!,req.body)
               
               

              res.json({
                success: true,
                data: concept
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

      async listConcept(req: Request, res: Response) {
    try {
      
      const concept = await this.listConceptUseCase.execute()
      

      res.json({
        success: true,
        data: concept
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}