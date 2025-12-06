import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { AlbumResponseDTO } from "../../dtos/album/AlbumResponseDTO";

@injectable()
export class ListAlbumsUseCase {
	constructor(
		@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository
	) {}

	async execute(): Promise<AlbumResponseDTO[]> {
		const albums = await this.albumRepository.findAll();

		return AlbumResponseDTO.fromEntities(albums);
	}
}
