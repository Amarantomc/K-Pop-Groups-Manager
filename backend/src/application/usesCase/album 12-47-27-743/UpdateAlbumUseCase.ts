import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { UpdateAlbumDto } from "../../dtos/album/UpdateAlbumDto";
import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class UpdateAlbumUseCase {
    constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository) {}

    async execute(id: number, data: UpdateAlbumDto): Promise<AlbumResponseDto> {
        const album = await this.albumRepository.update(id, data);
        return AlbumResponseDto.fromEntity(album);
    }
}
