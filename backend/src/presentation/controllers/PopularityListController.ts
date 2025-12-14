import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request,Response } from "express";
import PopularityList from '../../domain/entities/PopularityList';
import type { CreatePopularityListUseCase } from "../../application/usesCase/popularityList/CreatePopularityListUseCase";
import type { GetPopularityListUseCase } from "../../application/usesCase/popularityList/GetPopularityListUseCase";
import type { DeletePopularityListUseCase } from "../../application/usesCase/popularityList/DeletePopularityListUseCase";
import type { UpdatePopularityListUseCase } from "../../application/usesCase/popularityList/UpdatePopularityListUseCase";
import type { ListPopularityListUseCase } from "../../application/usesCase/popularityList/ListPopularityListUseCase";
 
import type { AddSongToPopularityListUseCase } from "../../application/usesCase/popularityList/AddSongToPopularityListUseCase";
import { CreatePopularityListDto } from "../../application/dtos/popularityList/CreatePopularityListDto";
import type { DeleteSongFromPopularityListUseCase } from "../../application/usesCase/popularityList/DeleteSongFromPopularityListuseCase";
import type { UpdatePositionInPopularityListUseCase } from "../../application/usesCase/popularityList/UpdatePositionInPopularityListUseCase";



@injectable()
export class PopularityListController {
    
constructor(@inject(Types.CreatePopularityListUseCase)  private createPopularityListUseCase: CreatePopularityListUseCase ,
            @inject(Types.GetPopularityListUseCase) private getPopularityListUseCase:GetPopularityListUseCase,
            @inject(Types.DeletePopularityListUseCase) private deletePopularityListUseCase:DeletePopularityListUseCase,
            @inject(Types.UpdatePopularityListUseCase) private updatePopularityListUseCase:UpdatePopularityListUseCase,
            @inject(Types.AddSongToPopularityListUseCase) private addSongToPopularityListUseCase:AddSongToPopularityListUseCase,
            @inject(Types.ListPopularityListsUseCase) private listPopularityListUseCase:ListPopularityListUseCase,
            @inject(Types.DeleteSongFromPopularityListUseCase) private deleteSongFromPopularityListUseCase:DeleteSongFromPopularityListUseCase,
            @inject(Types.UpdatePositionInPopularityListUseCase) private updatePositionInPopularityListUseCase:UpdatePositionInPopularityListUseCase,

          ){}
    
          async updateSongPositionInPopularityList(req: Request, res: Response) {
            try {
              const { popularityListId, songId, newPosition } = req.body;
          
              if (
                popularityListId === undefined ||
                songId === undefined ||
                newPosition === undefined
              ) {
                return res.status(400).json({
                  success: false,
                  error: "popularityListId, songId and newPosition are required",
                });
              }
          
              const updatedPopularityList =
                await this.updatePositionInPopularityListUseCase.execute({
                  popularityListId: Number(popularityListId),
                  songId: Number(songId),
                  newPosition: Number(newPosition),
                });
          
              return res.json({
                success: true,
                data: updatedPopularityList,
              });
            } catch (error: any) {
              return res.status(400).json({
                success: false,
                error: error.message,
              });
            }
          }
          

  async createPopularityList(req: Request, res: Response) 
      {
    try {
          
      const popularityListDto=CreatePopularityListDto.create(req.body)
      const popularityList = await this.createPopularityListUseCase.execute(popularityListDto);

      

      res.status(201).json({
        success: true,
        data: popularityList
      });

    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
      }

    async getPopularityList(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const popularityList = await this.getPopularityListUseCase.excute(id!);
               
               

              res.json({
                success: true,
                data: popularityList
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async addSongToPopularityList(req: Request, res: Response) {

    try{
      
    const popularityList = await this.addSongToPopularityListUseCase.execute(req.body)


        res.json({
          success: true,
          data: popularityList
        });
  
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
  }


  async deleteSongFromPopularityPopularityList(req: Request, res: Response) {

    try{
    const popularityList = await this.deleteSongFromPopularityListUseCase.execute(req.body)


        res.json({
          success: true,
          data: popularityList
        });
  
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
  }

    async deletePopularityList(req: Request, res: Response) {
    try {
      
        const { id } = req.params;
        const popularityList = await this.deletePopularityListUseCase.execute(id!)
      

      res.json({
        success: true,
        data: popularityList
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

       async updatePopularityList(req: Request, res: Response) 
      {
        try {
              const { id } = req.params;
              const popularityList = await this.updatePopularityListUseCase.execute(id!,req.body)
               
               

              res.json({
                success: true,
                data: popularityList
          });

    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

      async listPopularityList(req: Request, res: Response) {
    try {
      
      const popularityList = await this.listPopularityListUseCase.execute()
      

      res.json({
        success: true,
        data: popularityList
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

}