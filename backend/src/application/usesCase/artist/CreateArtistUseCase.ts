import { injectable,inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { CreateArtistDto } from "../../dtos/artist/CreateArtistDto";
import  { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
 

@injectable()
export class CreateArtistUseCase{

        constructor(
    @inject(Types.IArtistRepository) private artistRepository: IArtistRepository,
    @inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository,
    @inject (Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command:CreateArtistDto):Promise<ArtistResponseDto>
  {
        try{
            await this.unitOfWork.beginTransaction()
             
          // Validar que el aprendiz existe
      const apprentice = await this.apprenticeRepository.findById(
        command.apprenticeId.toString()
      );
      if (!apprentice) {
        throw new Error("Apprentice not found");
      }

      // Validar que el aprendiz no sea ya un artista en ese grupo
    //   const existingArtists = await this.artistRepository.findByApprenticeId(
    //     command.apprenticeId
    //   );
    //   const alreadyInGroup = existingArtists.some(
    //     (a) => a.groupId === command.groupId
    //   );
    //   if (alreadyInGroup) {
    //     throw new Error("This apprentice is already an artist in this group");
    //   }
 

            const artist = await this.artistRepository.create(command);
            await this.artistRepository.addGroupHistory(artist.ApprenticeId,artist.GroupId,artist.GroupId,"Member",new Date(command.DebutDate));
             
            await this.unitOfWork.commit();
            return ArtistResponseDto.fromEntity(artist)
        }
        catch(error){
            await this.unitOfWork.rollback();
            throw error;
        }
  }
}