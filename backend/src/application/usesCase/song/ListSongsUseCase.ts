import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { SongResponseDTO } from "../../dtos/song/SongResponseDTO";

@injectable()
export class ListSongsUseCase {
	constructor(
		@inject(Types.ISongRepository) private songRepository: ISongRepository
	) {}

	async execute(): Promise<SongResponseDTO[]> {
		const songs = await this.songRepository.findAll();

		return SongResponseDTO.fromEntities(songs);
	}
}
