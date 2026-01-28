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
    succes: ArtistWithSuccesDto|undefined;
    lastWorks: AlbumResponseDto|undefined;
}>
    ) {}

    async execute(data: RequestArtistWithIncomeDto): Promise<Buffer> {
        const  artist= await this.artists.execute(data);
        const newArtist={incomes:artist.incomes,lastWorks:artist.lastWorks[0],succes:artist.succes[0]}
        const arr=[newArtist]
        return this.pdfExporter.export(arr, {
            title: 'Ingresos Artista',
            filename: `ingreso_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                 
                { header: 'Total', dataKey: 'incomes.TotalIncome' },
                { header: 'Exitos', dataKey: 'succes.Title' },
                { header: 'Ultimo Trabajo', dataKey: 'lastWorks.title' },
                { header: 'NoCanciones', dataKey: 'lastWorks.noSongs' },
                { header: 'Copias Vendidas', dataKey: 'lastWorks.noCopiesSold' },
                 
                
            ]
        });
    }
}