import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
 
import type { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { GetSoloArtistsProfesionalHistoryUseCase } from "../artist/GetSoloArtistsProfesionalHistoryUseCase";
import type { RequestArtistWithIncomeDto } from "../../dtos/artist/RequestArtistWithIncomeDto";
import type { ArtistWithIncomeDto } from "../../dtos/artist/ArtistWithIncomeDto";
import type { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";
 

@injectable()
export class ExportSoloArtistPdfUseCase {
    constructor(
        @inject(Types.GetSoloArtistsProfesionalHistoryUseCase) private artists: GetSoloArtistsProfesionalHistoryUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ArtistResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const  artist= await this.artists.execute();
         
        return this.pdfExporter.export(artist, {
            title: 'Artistas Solistas',
            filename: `ingreso_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                 
               { header:'Nombre Artístico', dataKey: 'artist.ArtistName' },
                // { header:'Fecha Debut', dataKey: 'DebutDate' },
                // { header:'Estado', dataKey: 'Status' },
                // { header:'Nombre', dataKey: 'RealName' },
                 
                
            ]
        });
    }
}