import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { GetArtistsOnDebutUseCase } from "../artist/GetArtistsOnDebutUseCase";
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { ArtistOnDebutResponseDto } from "../../dtos/artist/ArtistsOnDebutResponseDto";

@injectable()
export class ExportArtistsOnDebutPdfUseCase {
    constructor(
        @inject(Types.GetArtistsOnDebutUseCase) private artist: GetArtistsOnDebutUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ArtistOnDebutResponseDto>
    ) {}

    async execute(agencyId:number): Promise<Buffer> {
        const artists= await this.artist.execute(agencyId)
        if(!artists){
            throw new Error('No se encontraron artistas en debut para la agencia especificada.');
        }

        return this.pdfExporter.export(artists, {
            title: 'Listado de Artistas en Debut',
            filename: `artists_debut_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header:'Nombre Artistico', dataKey: 'artistName' },
                { header:'Fecha Debut', dataKey: 'debutDate' },
                { header:'Nombre Grupo', dataKey: 'group.name' },
                { header:'Estado Grupo', dataKey: 'group.status' },
                
                 

                
                 
            ]
        });
    }
}