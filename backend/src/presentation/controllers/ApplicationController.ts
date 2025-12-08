import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request,Response } from "express";
import type { CreateApplicationUseCase } from "../../application/usesCase/application(solicitud)/CreateApplicatonUseCase";
import type { GetApplicationUseCase } from "../../application/usesCase/application(solicitud)/GetApplicationUseCase";
import type { DeleteApplicationUseCase } from "../../application/usesCase/application(solicitud)/DeleteApplicationUseCase";
import type { ListApplicationUseCase } from "../../application/usesCase/application(solicitud)/ListApplicationUseCase";
import { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";
import type { UpdateApplicationUseCase } from "../../application/usesCase/application(solicitud)/UpdateApplicationUseCase";
import type { CreateGroupUseCase } from "../../application/usesCase/group/CreateGroupUseCase";
import type { CreateGroupToApplicationUseCase } from "../../application/usesCase/application(solicitud)/CreateGroupToApplicationUseCase";


@injectable()
export class ApplicationController{
    constructor(@inject(Types.CreateApplicationUseCase)  private createApplicationUseCase: CreateApplicationUseCase ,
                @inject(Types.GetApplicationUseCase) private getApplicationUseCase:GetApplicationUseCase,
                @inject(Types.DeleteApplicationUseCase) private deleteApplicationUseCase:DeleteApplicationUseCase,
                @inject(Types.UpdateApplicationUseCase) private updateApplicationUseCase:UpdateApplicationUseCase,
                @inject(Types.ListApplicationUseCase) private listApplicationUseCase: ListApplicationUseCase,
                @inject(Types.CreateGroupToApplicationUseCase) private createGroupToApplicationUseCase: CreateGroupToApplicationUseCase,
              ){}

    async createApplication(req: Request, res: Response) 
          {
        try {
              
          const applicationDto=CreateApplicationDto.create(req.body)
          //console.log(applicationDto);
          const application = await this.createApplicationUseCase.execute(applicationDto);
    
          
    
          res.status(201).json({
            success: true,
            data: application
          });
    
        } catch (error: any) {
          res.status(400).json({
            success: false,
            error: error.message
          });
        }
          }


async getApplication(req: Request, res: Response) 
{
  try {
        const { id } = req.params;
        const application = await this.getApplicationUseCase.excute(id!);

        res.json({
          success: true,
          data: application
    })
    
}
catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }


}

async updateApplication(req: Request, res: Response) 
{
  try {
        const { id } = req.params;
        const application = await this.updateApplicationUseCase.execute(id!,req.body)
         
        res.json({
          success: true,
          data: application
    });

} catch (error: any) {
res.status(404).json({
  success: false,
  error: error.message
});
}
}

async deleteApplication(req: Request, res: Response) {
    try {
      
        const { id } = req.params;
        const application = await this.deleteApplicationUseCase.execute(id!)
      

      res.json({
        success: true,
        data: application
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
}

  async listApplication(req: Request, res: Response) {
    try {
      
      const application = await this.listApplicationUseCase.execute()
      

      res.json({
        success: true,
        data: application
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
}




async createGroupToApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const group = await this.createGroupToApplicationUseCase.execute(id!);

    return res.json({
      success: true,
      data: group
    });

  } catch (error: any) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

}






