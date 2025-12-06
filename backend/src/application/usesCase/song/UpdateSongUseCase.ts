import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import type { CreateSongDTO } from "../../dtos/song/CreateSongDTO";
import { SongResponseDTO } from "../../dtos/song/SongResponseDTO";

@injectable()
export class UpdateSongUseCase {
	constructor(
		@inject(Types.ISongRepository)
		private songRepository: ISongRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(
		id: string,
		payload: Partial<CreateSongDTO>
	): Promise<SongResponseDTO> {
		try {
			await this.unitOfWork.beginTransaction();

			const song = await this.songRepository.findById(id);
			if (!song) throw new Error("Song not found");

			const updated = await this.songRepository.update(id, payload);
			await this.unitOfWork.commit();

			return SongResponseDTO.fromEntity(updated);
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
