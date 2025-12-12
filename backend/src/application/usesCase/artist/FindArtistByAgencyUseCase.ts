import { injectable, inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IAgencyRepository } from "../../interfaces/repositories/IAgencyRepository";
import { ArtistResponseDto } from "../../dtos/artist/ArtistResponseDto";

@injectable()
export class FindArtistByAgencyUseCase {
    constructor(
        @inject(Types.IArtistRepository) private artistRepository: IArtistRepository,
        @inject(Types.IAgencyRepository) private agencyRepository: IAgencyRepository
    ) {}

    async execute(agencyId: number): Promise<ArtistResponseDto[]> {
         
        try {
            // Validar que el ID de agencia sea válido
            if (!agencyId || agencyId <= 0) {
                throw new Error("Invalid agency ID");
            }

            // Verificar que la agencia existe
            const agency = await this.agencyRepository.findById(agencyId.toString());
            if (!agency) {
                throw new Error(`Agency with ID ${agencyId} not found`);
            }

            // Obtener artistas de la agencia
            const artists = await this.artistRepository.findByAgency(agencyId);

            
            return artists.map(artist => ArtistResponseDto.fromEntityForManager(artist));

        } catch (error: any) {
            throw new Error(`Failed to find artists by agency: ${error.message}`);
        }
    }
}