import { CreateAlbumDto } from '../../dtos/album/CreateAlbumDto';
import { UpdateAlbumDto } from '../../dtos/album/UpdateAlbumDto';
import { AlbumResponseDto } from '../../dtos/album/AlbumResponseDto';

export interface IAlbumRepository {
    findAll(): Promise<AlbumResponseDto[]>;
    findById(id: number): Promise<AlbumResponseDto | null>;
    create(data: CreateAlbumDto): Promise<AlbumResponseDto>;
    update(id: number, data: UpdateAlbumDto): Promise<AlbumResponseDto>;
    delete(id: number): Promise<void>;
}
