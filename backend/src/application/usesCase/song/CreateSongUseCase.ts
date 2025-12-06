import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { CreateSongDTO } from "../../dtos/song/CreateSongDTO";
import { SongResponseDTO } from "../../dtos/song/SongResponseDTO";

@injectable()
export class CreateSongUseCase {
	constructor(
		@inject(Types.ISongRepository) private songRepository: ISongRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(command: CreateSongDTO): Promise<SongResponseDTO> {
		try {
			await this.unitOfWork.beginTransaction();

			const existingSong = await this.songRepository.findByTitle(command.title);
			if (existingSong) throw new Error("Song with this title already exists");

			const song = await this.songRepository.create(command);
			await this.unitOfWork.commit();

			return SongResponseDTO.fromEntity(song);
		} catch (error) {
			await this.unitOfWork.commit();
			throw error;
		}
	}
}
