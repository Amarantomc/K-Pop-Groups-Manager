import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { Request, Response } from "express";
import type { CreateSongUseCase } from "../../application/usesCase/song/CreateSongUseCase";
import type { FindSongByIdUseCase } from "../../application/usesCase/song/FindSongByIdUseCase";
import type { DeleteSongUseCase } from "../../application/usesCase/song/DeleteSongUseCase";
import { CreateSongDto } from "../../application/dtos/song/CreateSongDto";
 
 

@injectable()
export class SongController {
  constructor(
    @inject(Types.CreateSongUseCase) private createUseCase: CreateSongUseCase,
    @inject(Types.FindSongByIdUseCase) private findByIdUseCase: FindSongByIdUseCase,
    @inject(Types.DeleteSongUseCase) private deleteUseCase: DeleteSongUseCase,
  
  ) {}

  async createSong(req: Request, res: Response) {
    try {
      const dto = CreateSongDto.Create(req.body);
      const created = await this.createUseCase.execute(dto);
      res.status(201).json({ success: true, data: created });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const found = await this.findByIdUseCase.execute(id!);
      res.json({ success: true, data: found });
    } catch (e: any) {
      res.status(404).json({ success: false, error: e.message });
    }
  }

//   async getAll(req: Request, res: Response) {
//     try {
//       const songs = await this.getAllUseCase.execute();
//       res.json({ success: true, data: songs });
//     } catch (e: any) {
//       res.status(500).json({ success: false, error: e.message });
//     }
//   }

//   async updateSong(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const dto = UpdateSongDto.Create(req.body);
//       const updated = await this.updateUseCase.execute(Number(id), dto);
//       res.json({ success: true, data: updated });
//     } catch (e: any) {
//       res.status(400).json({ success: false, error: e.message });
//     }
//   }

  async deleteSong(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id!);
      res.json({ success: true, message: "Song deleted successfully" });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

//   async getByGenre(req: Request, res: Response) {
//     try {
//       const { genre } = req.params;
//       const songs = await this.getByGenreUseCase.execute(genre);
//       res.json({ success: true, data: songs });
//     } catch (e: any) {
//       res.status(400).json({ success: false, error: e.message });
//     }
//   }

//   async getByAlbum(req: Request, res: Response) {
//     try {
//       const { albumId } = req.params;
//       const songs = await this.getByAlbumUseCase.execute(Number(albumId));
//       res.json({ success: true, data: songs });
//     } catch (e: any) {
//       res.status(400).json({ success: false, error: e.message });
//     }
//   }

//   async addToPopularityList(req: Request, res: Response) {
//     try {
//       const dto = AddToPopularityListDto.Create(req.body);
//       await this.addToListUseCase.execute(dto);
//       res.json({ success: true, message: "Song added to popularity list" });
//     } catch (e: any) {
//       res.status(400).json({ success: false, error: e.message });
//     }
//   }

//   async search(req: Request, res: Response) {
//     try {
//       const { title } = req.query;
//       if (!title) {
//         return res.status(400).json({ 
//           success: false, 
//           error: "Title parameter is required" 
//         });
//       }
//       const songs = await this.searchUseCase.execute(title as string);
//       res.json({ success: true, data: songs });
//     } catch (e: any) {
//       res.status(400).json({ success: false, error: e.message });
//     }
//   }
}