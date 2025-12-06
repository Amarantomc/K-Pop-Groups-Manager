import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { SongResponseDTO } from "../../dtos/song/SongResponseDTO";

@injectable()
export class GetSongUseCase {
	constructor(
		@inject(Types.ISongRepository) private songRepository: ISongRepository
	) {}

	async execute(id: string): Promise<SongResponseDTO> {
		const song = await this.songRepository.findById(id);

		if (!song) throw new Error("Song not found");

		return SongResponseDTO.fromEntity(song);
	}
}
