import { injectable,inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import  { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";
import type { UpdateArtistDto } from "../../dtos/artist/UpdateArtistDto";
@injectable()
export class UpdateArtistUseCase{
     
    
    constructor(    @inject(Types.IArtistRepository) private artistRepository:IArtistRepository,
                    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork){}

    
    

async execute( id: string, data: Partial<UpdateArtistDto>): Promise<ArtistResponseDto> 
      {
        
        try {   
                await this.unitOfWork.beginTransaction()
                const artist = await this.artistRepository.findById(id);
                if (!artist) {
                throw new Error('Artist not found');
                }
    
                const updateArtist=await this.artistRepository.update(id,data);
                await this.unitOfWork.commit();
                return ArtistResponseDto.fromEntity(updateArtist)
        } catch (error) {
             await this.unitOfWork.rollback();
                throw error;
        }
    
      }
}