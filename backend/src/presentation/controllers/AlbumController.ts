import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request,Response } from "express";
import type { CreateAlbumUseCase } from "../../application/usesCase/album/CreateAlbumUseCase";
import type { GetAlbumUseCase } from "../../application/usesCase/album/GetAlbumUseCase";
import type { DeleteAlbumUseCase } from "../../application/usesCase/album/DeleteAlbumUseCase";
import type { UpdateAlbumUseCase } from "../../application/usesCase/album/UpdateAlbumUseCase";
import type { ListAlbumUseCase } from "../../application/usesCase/album/ListAlbumUseCase";
import { CreateAlbumDto } from "../../application/dtos/album/CreateAlbumDto";


@injectable()
export class AlbumController{
    constructor(@inject(Types.CreateAlbumUseCase)  private createAlbumUseCase: CreateAlbumUseCase ,
                @inject(Types.GetAlbumUseCase) private getAlbumUseCase:GetAlbumUseCase,
                @inject(Types.DeleteAlbumUseCase) private deleteAlbumUseCase:DeleteAlbumUseCase,
                @inject(Types.UpdateAlbumUseCase) private updateAlbumUseCase:UpdateAlbumUseCase,
                @inject(Types.ListAlbumUseCase) private listAlbumUseCase: ListAlbumUseCase,
              ){}

    async createAlbum(req: Request, res: Response) 
          {
        try {
              
          const albumDto=CreateAlbumDto.create(req.body)
          //console.log(albumDto);
          const album = await this.createAlbumUseCase.execute(albumDto);
    
          
    
          res.status(201).json({
            success: true,
            data: album
          });
    
        } catch (error: any) {
          res.status(400).json({
            success: false,
            error: error.message
          });
        }
          }


async getAlbum(req: Request, res: Response) 
{
  try {
        const { id } = req.params;
        const album = await this.getAlbumUseCase.excute(id!);

        res.json({
          success: true,
          data: album
    })
    
}
catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }


}

async updateAlbum(req: Request, res: Response) 
{
  try {
        const { id } = req.params;
        const album = await this.updateAlbumUseCase.execute(id!,req.body)
         
        res.json({
          success: true,
          data: album
    });

} catch (error: any) {
res.status(404).json({
  success: false,
  error: error.message
});
}
}

async deleteAlbum(req: Request, res: Response) {
    try {
      
        const { id } = req.params;
        const album = await this.deleteAlbumUseCase.execute(id!)
      

      res.json({
        success: true,
        data: album
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
}

  async listAlbum(req: Request, res: Response) {
    try {
      
      const albums = await this.listAlbumUseCase.execute()
      

      res.json({
        success: true,
        data: albums
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
}



}






