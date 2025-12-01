import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";

@injectable()
export class DeleteApplicationUseCase {
  constructor(@inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository,
                @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork) {}

  async execute(applicationId: string): Promise<void> {
    
    try {
       await this.unitOfWork.beginTransaction();  
      const application = await this.applicationRepository.findById(applicationId);

        if (!application) {
            throw new Error("Application not found");
          }

    await this.applicationRepository.delete(applicationId);
    await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
    
    
   
  }
}