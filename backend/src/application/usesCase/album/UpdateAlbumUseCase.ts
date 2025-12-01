import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import type { Album } from "../../../domain/entities/Album";

@injectable()
export class UpdateAlbumUseCase {
	constructor(
		@inject(Types.IAlbumRepository)
		private albumRepository: IAlbumRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(id: string, payload: Partial<Album>): Promise<Album> {
		try {
			await this.unitOfWork.beginTransaction();
			const updated = await this.albumRepository.update(id, payload);
			await this.unitOfWork.commit();
			return updated;
		} catch (err) {
			await this.unitOfWork.rollback();
			throw err;
		}
	}
}
