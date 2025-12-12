import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class ListAlbumUseCase {
	constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository) {}

	async execute(): Promise<AlbumResponseDto[]> {
		const list = await this.albumRepository.findAll();
		//console.log(list);
		return AlbumResponseDto.fromEntities(list)
	}
}