import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
 
 
import type { Artist } from "../../../domain/entities/Artist";
import type { IExportable } from "../../interfaces/exports/IExportable";
import type { FindArtistByAgencyUseCase } from "../artist/FindArtistByAgencyUseCase";
import type { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";

@injectable()
export class ExportArtistsToPdfUseCase {
    constructor(
        @inject(Types.FindArtistByAgencyUseCase) private artist: FindArtistByAgencyUseCase,
        @inject(Types.IExportable) private pdfExporter: IExportable<ArtistResponseDto>
    ) {}

    async execute(agencyId?: number): Promise<Buffer> {
        const artists= await this.artist.execute(agencyId!);
        artists.map(x=>{
            const nameGroup=x.groupHistory?.find(y=>y.id===x.GroupId)?.name
             x.debutGroup={name:nameGroup?nameGroup:""}
        })

        return this.pdfExporter.export(artists, {
            title: 'Listado de Artistas K-Pop',
            filename: `artistas_${Date.now()}.pdf`,
            orientation: 'landscape',
            columns: [
                { header:'ID Aprendiz', dataKey: 'ApprenticeId' },
                { header:'ID Grupo', dataKey: 'GroupId' },
                { header:'Nombre Artístico', dataKey: 'ArtistName' },
                { header:'Fecha Debut', dataKey: 'DebutDate' },
                { header:'Estado', dataKey: 'Status' },
                { header:'Grupo Debut', dataKey: 'debutGroup.name' },

                
                 
            ]
        });
    }
}