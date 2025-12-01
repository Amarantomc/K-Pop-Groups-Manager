import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request, Response } from "express";
import { AlbumResponseDTO } from "../../application/dtos/album/AlbumResponseDTO";
import { CreateAlbumUseCase } from "../../application/usesCase/album/CreateAlbumUseCase";
import { GetAlbumUseCase } from "../../application/usesCase/album/GetAlbumUseCase";
import { ListAlbumsUseCase } from "../../application/usesCase/album/ListAlbumsUseCase";
import { DeleteAlbumUseCase } from "../../application/usesCase/album/DeleteAlbumUseCAse";
import { UpdateAlbumUseCase } from "../../application/usesCase/album/UpdateAlbumUseCase";
import { FindAlbumByTitleUseCase } from "../../application/usesCase/album/FindAlbumByTitleUseCase";
import { CreateAlbumDTO } from "../../application/dtos/album/CreateAlbumDTO";

@injectable()
export class AlbumController {
	constructor(
		@inject(Types.CreateAlbumUseCase)
		private createAlbumUseCase: CreateAlbumUseCase,
		@inject(Types.GetAlbumUseCase) private getAlbumUseCase: GetAlbumUseCase,
		@inject(Types.ListAlbumsUseCase)
		private listAlbumsUseCase: ListAlbumsUseCase,
		@inject(Types.DeleteAlbumUseCase)
		private deleteAlbumUseCase: DeleteAlbumUseCase,
		@inject(Types.UpdateAlbumUseCase)
		private updateAlbumUseCase: UpdateAlbumUseCase,
		@inject(Types.FindAlbumByTitleUseCase)
		private findAlbumByTitleUseCase: FindAlbumByTitleUseCase
	) {}

	async createAlbum(req: Request, res: Response) {
		try {
			const albumDTO = CreateAlbumDTO.Create(req.body);
			const album = await this.createAlbumUseCase.execute(albumDTO);
			res.status(201).json({ success: true, data: album });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async getAlbum(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const album = await this.getAlbumUseCase.execute(id!);
			res.json({ success: true, data: album });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}

	async getAlbums(req: Request, res: Response) {
		try {
			const albums = await this.listAlbumsUseCase.execute();
			res.json({ success: true, data: albums });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	}

	async deleteAlbum(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await this.deleteAlbumUseCase.execute(id!);
			res.json({ success: true, message: "Album deleted successfully" });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async updateAlbum(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const album = await this.updateAlbumUseCase.execute(id!, req.body);
			const albumResponse = AlbumResponseDTO.fromEntity(album);
			res.json({ success: true, data: albumResponse });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findAlbumByTitle(req: Request, res: Response) {
		try {
			const { title } = req.params;
			const album = await this.findAlbumByTitleUseCase.execute(title!);
			res.json({ success: true, data: album });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}
}
