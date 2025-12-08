import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { SongResponseDto } from "../../dtos/song/SongResponseDto";

@injectable()
export class GetAllSongsUseCase {
  constructor(
    @inject(Types.ISongRepository) private repo: ISongRepository
  ) {}

  async execute(): Promise<SongResponseDto[]> {
    try {
        const songs = await this.repo.findAll();
        if(!songs){
            throw new Error("No songs found");
        }
    return SongResponseDto.fromEntities(songs);
    } catch (error) {
        throw error
    }
    
    
  }
}