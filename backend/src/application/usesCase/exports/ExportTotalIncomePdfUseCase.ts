import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
 
import type { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { GetTotalIncomeByArtistUseCase } from "../artist/GetTotalIncomeByArtistUseCase";
import type { RequestArtistWithIncomeDto } from "../../dtos/artist/RequestArtistWithIncomeDto";
import type { ArtistWithIncomeDto } from "../../dtos/artist/ArtistWithIncomeDto";
import type { GetIncomeAndSuccesUseCase } from "../artist/GetIncomeAndSuccesUseCase";
import type { ArtistWithSuccesDto } from "../../dtos/artist/ArtistWithSuccesDto";
import type { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class ExportTotalIncomePdfUseCase {
    constructor(
        @inject(Types.GetIncomeAndSuccesUseCase) private artists: GetIncomeAndSuccesUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<{
    incomes: ArtistWithIncomeDto;
    succes: ArtistWithSuccesDto[];
    lastWorks: AlbumResponseDto[];
}>
    ) {}

    async execute(data: RequestArtistWithIncomeDto): Promise<Buffer> {
        const  artist= await this.artists.execute(data);
        const arr=[artist]
        return this.pdfExporter.export(arr, {
            title: 'Ingresos Artista',
            filename: `ingreso_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                 
                { header: 'Total', dataKey: 'incomes' },
                 
                
            ]
        });
    }
}