import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
import type { IExportable } from "../../interfaces/exports/IExportable";
 
import type { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { GetSoloArtistsProfesionalHistoryUseCase } from "../artist/GetSoloArtistsProfesionalHistoryUseCase";
import type { RequestArtistWithIncomeDto } from "../../dtos/artist/RequestArtistWithIncomeDto";
import type { ArtistWithIncomeDto } from "../../dtos/artist/ArtistWithIncomeDto";
import type { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";
import { Artist } from "../../../domain/entities/Artist";
import type { Album } from "../../../domain";
import type { Group } from "../../../domain/entities/Group";
import type { ContractResponseDto } from "../../dtos/contract/ContractResponseDto";
import type { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";
import type { x } from "pdfkit";
import { albumColumns } from "../../../../../frontend/src/config/datatableSource";
 

@injectable()
export class ExportSoloArtistPdfUseCase {
    constructor(
        @inject(Types.GetSoloArtistsProfesionalHistoryUseCase) private artists: GetSoloArtistsProfesionalHistoryUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<{
            artist:Artist,
            album:Album,
            group:Group,
            contract:ContractResponseDto,
            activity:ActivityResponseDto,
            albumsSold:number

        }>
    ) {}

    async execute(): Promise<Buffer> {
        const  artist= await this.artists.execute();
        const simplifiedArtists = artist.map((item: { artist: any; albums: any[]; groupHistory: any[]; contracts: any[]; activities: any[]; totalAlbumsSold: any; }) => ({
    artist: item.artist,
     
    album: item.albums[0] ?? null, 
    group: item.groupHistory?.[0] ?? null,
    contract: item.contracts[0],
    activity: item.activities[0],
    albumsSold: item.totalAlbumsSold
}));
         
        return this.pdfExporter.export(simplifiedArtists, {
            title: 'Artistas Solistas',
            filename: `ingreso_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                 
               { header:'Nombre Artístico', dataKey: 'artist.ArtistName' },
             { header:'Album Exito', dataKey: 'album.title' },
             { header:'Copias Vendidas', dataKey: 'album.noCopiesSold' },
             { header:'Total Albumes Vendidos', dataKey: 'albumsSold' },
             { header:'Grupo', dataKey: 'group.name' },
             { header:'Tipo Evento', dataKey: 'activity.eventType' },
             { header:'Lugar', dataKey: 'activity.place' },
             { header:'Fecha', dataKey: 'activity.date' },
                 
                
            ]
        });
    }
}