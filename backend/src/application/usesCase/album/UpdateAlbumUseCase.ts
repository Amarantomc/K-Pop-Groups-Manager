import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import type { CreateAlbumDTO } from "../../dtos/album/CreateAlbumDTO";
import { AlbumResponseDTO } from "../../dtos/album/AlbumResponseDTO";

@injectable()
export class UpdateAlbumUseCase {
	constructor(
		@inject(Types.IAlbumRepository)
		private albumRepository: IAlbumRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(
		id: string,
		payload: Partial<CreateAlbumDTO>
	): Promise<AlbumResponseDTO> {
		try {
			await this.unitOfWork.beginTransaction();

			const album = await this.albumRepository.findById(id);
			if (!album) throw new Error("Album not found");

			const updated = await this.albumRepository.update(id, payload);
			await this.unitOfWork.commit();
			return AlbumResponseDTO.fromEntity(updated);
		} catch (error) {
			console.log(error);
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
