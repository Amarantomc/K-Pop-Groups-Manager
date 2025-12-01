import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { CreateAlbumDTO } from "../../dtos/album/CreateAlbumDTO";
import { AlbumResponseDTO } from "../../dtos/album/AlbumResponseDTO";

@injectable()
export class CreateAlbumUseCase {
	constructor(
		@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository,
		@inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
	) {}

	async execute(command: CreateAlbumDTO): Promise<AlbumResponseDTO> {
		try {
			await this.unitOfWork.beginTransaction();
			const existingAlbum = await this.albumRepository.findByTitle(
				command.title
			);
			if (existingAlbum)
				throw new Error("Album with this title already exists");
			const album = await this.albumRepository.create(command);
			await this.unitOfWork.commit();
			return AlbumResponseDTO.fromEntity(album);
		} catch (error) {
			await this.unitOfWork.commit();
			throw error;
		}
	}
}
