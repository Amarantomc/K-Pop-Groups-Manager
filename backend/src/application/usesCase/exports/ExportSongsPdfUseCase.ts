import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { GetAllSongsUseCase } from "../song/GetAllSongsUseCase";
import type { SongResponseDto } from "../../dtos/song/SongResponseDto";

@injectable()
export class ExportSongsPdfUseCase {
    constructor(
        @inject(Types.GetAllSongsUseCase) private songs: GetAllSongsUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<SongResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const song = await this.songs.execute();
        
        return this.pdfExporter.export(song, {
            title: 'Listado de Canciones',
            filename: `songs_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                 
                { header: 'Título', dataKey: 'title' },
                { header: 'Productor', dataKey: 'producer' },
                { header: 'Fecha Lanzamiento', dataKey: 'releaseDate' },
                { header: 'Genero', dataKey: 'gender' },
                
            ]
        });
    }
}