import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { UpdateAlbumDto } from "../../dtos/album/UpdateAlbumDto";
import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class UpdateAlbumUseCase {
    constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository) {}

    async execute(id: number, data: UpdateAlbumDto): Promise<AlbumResponseDto> {
        const album = await this.albumRepository.update(id, data);
        return AlbumResponseDto.fromEntity(album);
    }
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import type { UpdateAlbumDTO } from "../../dtos/album/UpdateAlbumDTO";
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
		payload: UpdateAlbumDTO
	): Promise<AlbumResponseDTO> {
		try {
			await this.unitOfWork.beginTransaction();

			const album = await this.albumRepository.findById(id);
			if (!album) throw new Error("Album not found");

			const updated = await this.albumRepository.update(id, payload);
			await this.unitOfWork.commit();
			return AlbumResponseDTO.fromEntity(updated);
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}
