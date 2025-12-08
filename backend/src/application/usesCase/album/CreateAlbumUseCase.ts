import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import { CreateAlbumDto } from "../../dtos/album/CreateAlbumDto";
import { AlbumResponseDto } from "../../dtos/album/AlbumResponseDto";

@injectable()
export class CreateAlbumUseCase {
    constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository) {}

    async execute(data: CreateAlbumDto): Promise<AlbumResponseDto> {
        const album = await this.albumRepository.create(data);
        return AlbumResponseDto.fromEntity(album);
    }
}
