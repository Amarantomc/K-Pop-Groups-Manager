import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
 
import { SongResponseDto } from "../../dtos/song/SongResponseDto";
import type { CreateSongDto } from "../../dtos/song/CreateSongDto";

@injectable()
export class UpdateSongUseCase {
  constructor(
    @inject(Types.ISongRepository) private repo: ISongRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, data: Partial<CreateSongDto>): Promise<SongResponseDto> {
    try {
      await this.unitOfWork.beginTransaction();

      const existingSong = await this.repo.findById(id);
      if (!existingSong) {
        throw new Error("Song not found");
      }

      const song = await this.repo.update(id, data);

      await this.unitOfWork.commit();
      return SongResponseDto.fromEntity(song);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}