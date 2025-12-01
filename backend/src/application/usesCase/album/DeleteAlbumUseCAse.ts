import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";

@injectable()
export class DeleteAlbumUseCase {
	constructor(
		@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(id: string): Promise<void> {
		try {
			await this.unitOfWork.beginTransaction();
			await this.albumRepository.delete(id);
			await this.unitOfWork.commit();
		} catch (err) {
			await this.unitOfWork.rollback();
			throw err;
		}
	}
}
