import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { AlbumResponseDTO } from "../../dtos/album/AlbumResponseDTO";

@injectable()
export class FindAlbumByTitleUseCase {
	constructor(
		@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository
	) {}

	async execute(title: string): Promise<AlbumResponseDTO | null> {
		const album = await this.albumRepository.findByTitle(title);
		if (!album) throw new Error("Album not found");
		return AlbumResponseDTO.fromEntity(album);
	}
}
