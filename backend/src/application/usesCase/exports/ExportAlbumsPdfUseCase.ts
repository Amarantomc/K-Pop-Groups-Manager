import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { ListAlbumUseCase } from "../album/ListAlbumUseCase";
import type { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class ExportAlbumsPdfUseCase {
    constructor(
        @inject(Types.ListAlbumUseCase) private albums: ListAlbumUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<AlbumResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const album = await this.albums.execute();
        
        return this.pdfExporter.export(album, {
            title: 'Listado de Álbumes',
            filename: `albums_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header: 'Id', dataKey: 'id' },
                { header: 'Título', dataKey: 'title' },
                { header: 'Fecha Lanzamiento', dataKey: 'releaseDate' },
                { header: 'Productor', dataKey: 'producer' },
                { header: 'No. Canciones', dataKey: 'noSongs' },
                { header: 'No. Copias Vendidas', dataKey: 'noCopiesSold' }
            ]
        });
    }
}