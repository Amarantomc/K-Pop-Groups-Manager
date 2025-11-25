import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { SongResponseDTO } from "../../dtos/song/SongResponseDTO";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";


@injectable()
export class ListSongUseCase {
	constructor(@inject(Types.ISongRepository) private songRepository: ISongRepository) {}

	async execute(): Promise<SongResponseDTO[]> {
		const list = await this.songRepository.findAll();
		return SongResponseDTO.fromEntities(list)
	}
}