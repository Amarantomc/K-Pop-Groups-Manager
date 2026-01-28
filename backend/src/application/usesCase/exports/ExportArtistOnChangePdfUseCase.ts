import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
 
import type { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { GetArtistsWhoChangeAgencyUseCase } from "../artist/GetArtistsWhoChangeAgencyUseCase";
import type { RequestArtistWithIncomeDto } from "../../dtos/artist/RequestArtistWithIncomeDto";
import type { ArtistWithIncomeDto } from "../../dtos/artist/ArtistWithIncomeDto";
import type { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";

@injectable()
export class ExportArtistOnChangePdfUseCase {
    constructor(
        @inject(Types.GetArtistsWhoChangeAgencyUseCase) private artists: GetArtistsWhoChangeAgencyUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ArtistResponseDto>
    ) {}

    async execute(): Promise<Buffer> {
        const  artist= await this.artists.execute();
         
        return this.pdfExporter.export(artist, {
            title: 'Artistas que han cambiado de Agencia',
            filename: `ingreso_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                 
               { header:'Nombre Artístico', dataKey: 'ArtistName' },
                { header:'Fecha Debut', dataKey: 'DebutDate' },
                { header:'Estado', dataKey: 'Status' },
                { header:'Nombre', dataKey: 'RealName' },
                 
                
            ]
        });
    }
}