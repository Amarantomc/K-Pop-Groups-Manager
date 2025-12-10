import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";

@injectable()
export class DeleteAlbumUseCase {
  constructor(@inject(Types.IAlbumRepository) private albumRepository: IAlbumRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(albumId: string): Promise<void> {
    
    try {
       await this.unitOfWork.beginTransaction();  
      const album = await this.albumRepository.findById(albumId);

        if (!album) {
            throw new Error("Album not found");
          }

    await this.albumRepository.delete(albumId);
    await this.unitOfWork.commit();
    
    } catch (error) {
      console.log(error);
      await this.unitOfWork.rollback();
      throw error;
    }
    
    
   
  }
}