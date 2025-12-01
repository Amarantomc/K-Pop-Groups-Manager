import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { AlbumResponseDTO } from "../../dtos/album/AlbumResponseDTO";

@injectable()
export class GetAlbumUseCase {
	constructor(
		@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository
	) {}

	async execute(id: string): Promise<AlbumResponseDTO> {
		const album = await this.albumRepository.findById(id);
		if (!album) throw new Error("Album not found");
		return AlbumResponseDTO.fromEntity(album);
	}
}
