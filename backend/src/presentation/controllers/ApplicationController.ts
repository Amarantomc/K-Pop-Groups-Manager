import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request,Response } from "express";
import type { CreateApplicationUseCase } from "../../application/usesCase/application(solicitud)/CreateApplicatonUseCase";
import type { GetApplicationUseCase } from "../../application/usesCase/application(solicitud)/GetApplicationUseCase";
import type { DeleteApplicationUseCase } from "../../application/usesCase/application(solicitud)/DeleteApplicationUseCase";
import type { ListApplicationUseCase } from "../../application/usesCase/application(solicitud)/ListApplicationUseCase";
import { CreateApplicationDto } from "../../application/dtos/application(solicitud)/CreateApplicationDto";
import type { UpdateApplicationUseCase } from "../../application/usesCase/application(solicitud)/UpdateApplicationUseCase";
import type { CreateGroupToApplicationUseCase } from "../../application/usesCase/application(solicitud)/CreateGroupToApplicationUseCase";
import type { AttractApprenticesUseCase } from "../../application/usesCase/apprentice/AttractApprenticeUsaCase";
import type { CreateRolApplicationUseCase } from "../../application/usesCase/application(solicitud)/CreateRolApplicationUseCase";
import { CreateRolApplicationDto } from "../../application/dtos/application(solicitud)/CreateRolApplicationDto";
import type { GetApprenticesWhithoutApplicationUseCase } from "../../application/usesCase/apprentice/getApprenticesWhithoutApplicationUseCase";
import type { ApprenticeDecisionByApplicationUseCase } from "../../application/usesCase/apprentice/ApprenticeDecisionByApplicationUseCase";
import type { ArtistDecisionByApplicationUseCase } from "../../application/usesCase/apprentice/ArtistDecisionByApplicationUseCase";
import type { SoloistsArtistWhithoutApplicationUseCase } from "../../application/usesCase/application(solicitud)/SoloistsArtistWhithoutApplicationUseCase";


@injectable()
export class ApplicationController{
    constructor(@inject(Types.CreateApplicationUseCase)  private createApplicationUseCase: CreateApplicationUseCase ,
                @inject(Types.GetApplicationUseCase) private getApplicationUseCase:GetApplicationUseCase,
                @inject(Types.DeleteApplicationUseCase) private deleteApplicationUseCase:DeleteApplicationUseCase,
                @inject(Types.UpdateApplicationUseCase) private updateApplicationUseCase:UpdateApplicationUseCase,
                @inject(Types.ListApplicationUseCase) private listApplicationUseCase: ListApplicationUseCase,
                @inject(Types.CreateRolApplicationUseCase)  private createRolApplicationUseCase: CreateRolApplicationUseCase,
                @inject(Types.CreateGroupToApplicationUseCase) private createGroupToApplicationUseCase: CreateGroupToApplicationUseCase,
                @inject(Types.AttractApprenticesUseCase)private attractApprenticesUseCase: AttractApprenticesUseCase,
                @inject(Types.SoloistsArtistWhithoutApplicationUseCase)private soloistsArtistWhithoutApplication: SoloistsArtistWhithoutApplicationUseCase,
                @inject(Types.GetApprenticesWhithoutApplicationUseCase)private getApprenticesWhithoutApplicationUseCase: GetApprenticesWhithoutApplicationUseCase,
                @inject(Types.ApprenticeDecisionByApplicationUseCase)private apprenticeDecisionByApplicationUseCase: ApprenticeDecisionByApplicationUseCase,
                @inject(Types.ArtistDecisionByApplicationUseCase)private artistDecisionByApplicationUseCase: ArtistDecisionByApplicationUseCase,
              ){}


     // PATCH /applications/:id/artist-decision
async artistDecisionByApplication(req: Request, res: Response) {
  try {
    const { id } = req.params; // idSolicitud
    const { apprenticeId, groupId, decision } = req.body;

    await this.artistDecisionByApplicationUseCase.execute(
      Number(id),
      Number(apprenticeId),
      Number(groupId),
      Boolean(decision)
    );

    return res.status(200).json({
      success: true,
      message: "Artist decision updated successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}         
// PATCH /applications/:id/apprentice-decision
async apprenticeDecisionByApplication(req: Request, res: Response) {
  try {
    const { id } = req.params; // idSolicitud
    const { apprenticeId, decision } = req.body;

    await this.apprenticeDecisionByApplicationUseCase.execute(
      Number(id),
      Number(apprenticeId),
      Boolean(decision)
    );

    return res.status(200).json({
      success: true,
      message: "Apprentice decision updated successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

async getApprenticesWhithoutApplication(req: Request, res: Response) {
  try {
    const apprentices =
      await this.getApprenticesWhithoutApplicationUseCase.execute();

    return res.status(200).json({
      success: true,
      data: apprentices,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

     async soloistsArtist(req: Request, res: Response) {
                try {
                  const artists = await this.soloistsArtistWhithoutApplication.execute();
              
                  return res.status(200).json({
                    success: true,
                    data: artists,
                  });
              
                } catch (error: any) {
                  return res.status(500).json({
                    success: false,
                    error: error.message,
                  });
                }
     }

     async attractApprentice(req: Request, res: Response) {
                const { apprenticeId, agencyId } = req.body;
              
                await this.attractApprenticesUseCase.execute(
                  Number(apprenticeId),
                  Number(agencyId)
                );
              
                res.status(200).json({
                  success: true,
                  message: "Apprentice transferred successfully",
                });
     }

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

    async createRolApplication(req: Request, res: Response) 
          {
        try {
              
          const applicationDto=CreateRolApplicationDto.create(req.body)
          const application = await this.createRolApplicationUseCase.execute(applicationDto);
    
          
    
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

    //const applicationcreategroupDto = ApplicationToGroupDto.create(id!);
    //const app = await this.getApplicationUseCase.excute(id!)
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






