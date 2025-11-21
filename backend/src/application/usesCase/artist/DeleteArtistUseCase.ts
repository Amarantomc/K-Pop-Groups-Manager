import { inject } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

export class DeleteArtistUseCase {

    constructor ( @inject(Types.IArtistRepository) private artistRepository:IArtistRepository,
                    @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
){}

    async excute(id:any):Promise<void>{
        
        try {   
            await this.unitOfWork.beginTransaction()
            const artist = await this.artistRepository.findById(id);
            if (!artist) {
                throw new Error('User not found');
            }

            await this.artistRepository.delete(id);
            await this.unitOfWork.commit();
    } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
    }
 }
}