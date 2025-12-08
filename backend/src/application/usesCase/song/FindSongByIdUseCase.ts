import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { SongResponseDto } from "../../dtos/song/SongResponseDto";

@injectable()
export class FindSongByIdUseCase {
  constructor(
    @inject(Types.ISongRepository) private repo: ISongRepository
  ) {}

  async execute(id: string): Promise<SongResponseDto> {
    try {
        const song = await this.repo.findById(id);
    if (!song) {
      throw new Error("Song not found");
    }
    return SongResponseDto.fromEntity(song);
  }
     catch (error:any) {
        throw error;
    }
    
    
}}