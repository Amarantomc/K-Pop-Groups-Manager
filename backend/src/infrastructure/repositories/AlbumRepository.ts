import { inject, injectable } from "inversify";
import { Types } from "../di/Types";
import type { UnitOfWork } from "../PrismaUnitOfWork";
import type { IAlbumRepository } from "../../application/interfaces/repositories/IAlbumRepository.ts";
import { AlbumResponseDto } from "../../application/dtos/album/AlbumResponseDto";
import type { CreateAlbumDto } from "../../application/dtos/album/CreateAlbumDto";
import type { UpdateAlbumDto } from "../../application/dtos/album/UpdateAlbumDto";

@injectable()
export class AlbumRepository implements IAlbumRepository {
    constructor(
        @inject(Types.PrismaClient) private prisma: any,
        @inject(Types.IUnitOfWork) private unitOfWork: UnitOfWork
    ) {}

    private get db() {
        return this.unitOfWork.getTransaction();
    }

    async findAll() {
        const albums = await this.db.Album.findMany();
        return AlbumResponseDto.fromEntities(albums);
    }

    async findById(id: number) {
        const album = await this.db.Album.findUnique({ where: { id } });
        return album ? AlbumResponseDto.fromEntity(album) : null;
    }

    async create(data: CreateAlbumDto) {
        const album = await this.db.Album.create({ data });
        return AlbumResponseDto.fromEntity(album);
    }

    async update(id: number, data: UpdateAlbumDto) {
        const album = await this.db.Album.update({ where: { id }, data });
        return AlbumResponseDto.fromEntity(album);
    }

    async delete(id: number) {
        await this.db.Album.delete({ where: { id } });
    }
}
