import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";

@injectable()
export class DeleteSongUseCase {
	constructor(
		@inject(Types.ISongRepository) private songRepository: ISongRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(id: string): Promise<void> {
		try {
			await this.unitOfWork.beginTransaction();

			const song = await this.songRepository.findById(id);
			if (!song) throw new Error("Song not found");

			await this.songRepository.delete(id);
			await this.unitOfWork.commit();
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
