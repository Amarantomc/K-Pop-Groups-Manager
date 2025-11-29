import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { CreateArtistUseCase } from "../../application/usesCase/artist/CreateArtistUseCase";
import type { UpdateArtistUseCase } from "../../application/usesCase/artist/UpdateArtistUseCase";
import type { DeleteArtistUseCase } from "../../application/usesCase/artist/DeleteArtistUseCase";
import type { FindArtistByIdUseCase } from "../../application/usesCase/artist/FindArtistByIdUseCase";
import { CreateArtistDto } from "../../application/dtos/artist/CreateArtistDto";
import type { Request,Response } from 'express';
import { UpdateArtistDto } from "../../application/dtos/artist/UpdateArtistDto";
import type { GetAllArtistsUseCase } from "../../application/usesCase/artist/GetAllArtistsUseCase";
import type { FindArtistByAgencyUseCase } from "../../application/usesCase/artist/FindArtistByAgencyUseCase";

@injectable()
export class ArtistController {

    constructor(@inject(Types.CreateArtistUseCase) private createArtistUseCase :CreateArtistUseCase,
                @inject(Types.UpdateArtistUseCase) private updateArtistUseCase :UpdateArtistUseCase,
                @inject(Types.DeleteArtistUseCase) private deleteArtistUseCase :DeleteArtistUseCase,
                @inject(Types.FindArtistByIdUseCase) private findArtistByIdUseCase :FindArtistByIdUseCase,
              @inject(Types.GetAllArtistsUseCase) private getAllArtistsUseCase :GetAllArtistsUseCase,
              @inject(Types.FindArtistByAgencyUseCase) private findArtistByAgency : FindArtistByAgencyUseCase){}


    async createArtist(req:Request,res:Response){
        try {
            const artistDto=CreateArtistDto.Create(req.body)
             
            const artist=await this.createArtistUseCase.execute(artistDto)
            res.status(201).json({
        success: true,
        data: artist
      });
            
        } catch (error:any) {
        
            res.status(400).json({
            success: false,
            error: error.message
      });
        }
    }

    async findById(req:Request,res:Response)
    {
        try {
            const {apprenticeId,groupId}=req.params
            const artist= await this.findArtistByIdUseCase.execute({apprenticeId: Number(apprenticeId), groupId: Number(groupId)})
            res.json({
                success: true,
                data: artist
          });
            
        } catch (error:any) {
        
            res.status(404).json({
        success: false,
        error: error.message
      });
        }
    }

    async deleteArtist(req:Request,res:Response)
    {
        try {
            const {apprenticeId,groupId}=req.params
            await this.deleteArtistUseCase.excute({apprenticeId: Number(apprenticeId), groupId: Number(groupId)})
        res.json({
        success: true,
        message: 'Artist deleted successfully'
      });
            
        } catch (error:any) {
        
            res.status(400).json({
        success: false,
        error: error.message
      });
        }
    }

    async updateArtist(req:Request,res:Response)
    {
        try {
            const {apprenticeId,groupId}=req.params
            
            
            const artist= await this.updateArtistUseCase.execute({apprenticeId: Number(apprenticeId), groupId: Number(groupId)},req.body)
        
        res.json({
        success: true,
        data: artist
      });

            
        } catch (error:any) {
        res.status(400).json({
        success: false,
        error: error.message
      });
        }
    }

    async getAll(req:Request,res:Response){
          try {
             const artists= await this.getAllArtistsUseCase.execute()
        
        res.json({
        success: true,
        data: artists
      });

            
        } catch (error:any) {
        res.status(400).json({
        success: false,
        error: error.message
      });
        }
    }

     async getArtistsByAgency(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        const artists = await this.findArtistByAgency.execute(Number(id));
        
        res.json({
            success: true,
            data: artists,
            
        });
        
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}
}