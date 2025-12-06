import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { ISongRepository } from "../../interfaces/repositories/ISongRepository";
import { SongResponseDTO } from "../../dtos/song/SongResponseDTO";

@injectable()
export class FindSongByTitleUseCase {
	constructor(
		@inject(Types.ISongRepository) private songRepository: ISongRepository
	) {}

	async execute(title: string): Promise<SongResponseDTO | null> {
		const song = await this.songRepository.findByTitle(title);

		if (!song) throw new Error("Song not found");

		return SongResponseDTO.fromEntity(song);
	}
}
