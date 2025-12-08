import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class GetAlbumUseCase {
    constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository) {}

    async execute(id: number): Promise<AlbumResponseDto | null> {
        const album = await this.albumRepository.findById(id);
        return album ? AlbumResponseDto.fromEntity(album) : null;
    }
}
