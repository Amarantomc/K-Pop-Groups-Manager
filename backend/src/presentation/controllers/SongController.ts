import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request, Response } from "express";
import { CreateSongUseCase } from "../../application/usesCase/song/CreateSongUseCase";
import { GetSongUseCase } from "../../application/usesCase/song/GetSongUseCase";
import { ListSongsUseCase } from "../../application/usesCase/song/ListSongsUseCase";
import { DeleteSongUseCase } from "../../application/usesCase/song/DeleteSongUseCase";
import { UpdateSongUseCase } from "../../application/usesCase/song/UpdateSongUseCase";
import { FindSongByTitleUseCase } from "../../application/usesCase/song/FindSongByTitleUseCase";
import { CreateSongDTO } from "../../application/dtos/song/CreateSongDTO";

@injectable()
export class SongController {
	constructor(
		@inject(Types.CreateSongUseCase)
		private createSongUseCase: CreateSongUseCase,
		@inject(Types.GetSongUseCase) private getSongUseCase: GetSongUseCase,
		@inject(Types.UpdateSongUseCase)
		private updateSongUseCase: UpdateSongUseCase,
		@inject(Types.DeleteSongUseCase)
		private deleteSongUseCase: DeleteSongUseCase,
		@inject(Types.ListSongsUseCase)
		private listSongsUseCase: ListSongsUseCase,
		@inject(Types.FindSongByTitleUseCase)
		private findSongByTitleUseCase: FindSongByTitleUseCase
	) {}

	async createSong(req: Request, res: Response) {
		try {
			const songDTO = CreateSongDTO.Create(req.body);
			const song = await this.createSongUseCase.execute(songDTO);
			res.status(201).json({ success: true, data: song });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async getSong(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const song = await this.getSongUseCase.execute(id!);
			res.json({ success: true, data: song });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}

	async getSongs(req: Request, res: Response) {
		try {
			const songs = await this.listSongsUseCase.execute();
			res.json({ success: true, data: songs });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	}

	async deleteSong(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await this.deleteSongUseCase.execute(id!);
			res.json({ success: true, message: "Song deleted successfully" });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async updateSong(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const song = await this.updateSongUseCase.execute(id!, req.body);
			res.json({ success: true, data: song });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findSongByTitle(req: Request, res: Response) {
		try {
			const { title } = req.params;
			const song = await this.findSongByTitleUseCase.execute(title!);
			res.json({ success: true, data: song });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}
}
