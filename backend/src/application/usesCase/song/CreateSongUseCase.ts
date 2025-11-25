import type { Song } from "../../../domain";
import CreateSongDTO from "../../dtos/song/CreateSongDTO";
import { SongResponseDTO } from "../../dtos/song/SongResponseDTO";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";


@injectable()
export class CreateSongUseCase{

    constructor(
    @inject(Types.ISongRepository) private songRepository: ISongRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreateSongDTO):Promise<SongResponseDTO>{
        try
        {
            await this.unitOfWork.beginTransaction();
            const song = await this.songRepository.create(command);
            await this.unitOfWork.commit();
            
            return new SongResponseDTO(
                song.id,
                song.title,
                song.releaseDate,
                song.producer,
                song.gender,
            );
        }
        catch(error){
            await this.unitOfWork.rollback();
            throw error;
        }
      }
}