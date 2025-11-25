import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { inject, injectable } from "inversify";


@injectable()
export class DeleteSongUseCase {
  constructor(@inject(Types.ISongRepository) private songRepository: ISongRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(songId: string): Promise<void> {
    const song = await this.songRepository.findById(songId);

    if (!song) {
      throw new Error("Song not found");
    }

    await this.songRepository.delete(songId);
  }
}