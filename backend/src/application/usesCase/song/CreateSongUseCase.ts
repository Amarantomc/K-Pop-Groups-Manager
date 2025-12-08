import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import { CreateSongDto } from "../../dtos/song/CreateSongDto";
import { SongResponseDto } from "../../dtos/song/SongResponseDto";

@injectable()
export class CreateSongUseCase {
  constructor(
    @inject(Types.ISongRepository) private songRepository: ISongRepository,
    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command: CreateSongDto): Promise<SongResponseDto> {
    try {
      await this.unitOfWork.beginTransaction();

      const song = await this.songRepository.create(command);

      await this.unitOfWork.commit();
      return SongResponseDto.fromEntity(song);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}