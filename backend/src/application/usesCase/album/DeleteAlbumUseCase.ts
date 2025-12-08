import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";

@injectable()
export class DeleteAlbumUseCase {
    constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository) {}

    async execute(id: number): Promise<void> {
        await this.albumRepository.delete(id);
    }
}
