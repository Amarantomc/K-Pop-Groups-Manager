import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import CreateSongDTO from "../../dtos/song/CreateSongDTO";
import {SongResponseDTO} from "../../dtos/song/SongResponseDTO";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";



@injectable()
export class UpdateSongUseCase {
  constructor(@inject(Types.ISongRepository) private songRepository: ISongRepository) {}

  async execute(
    songId: string,
    data: Partial<CreateSongDTO>
  ): Promise<SongResponseDTO> {

    const song = await this.songRepository.findById(songId);

    if (!song) {
      throw new Error("Apprentice not found");
    }

    const updatedSong = await this.songRepository.update(songId, data);

    return new SongResponseDTO(
      updatedSong.id,
      updatedSong.title,
      updatedSong.releaseDate,
      updatedSong.producer,
      updatedSong.gender,
    );
  }
}