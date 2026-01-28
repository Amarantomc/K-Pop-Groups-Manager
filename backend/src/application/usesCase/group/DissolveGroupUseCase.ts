import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";
import type { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";
import { error } from "console";

@injectable()
export class DissolveGroupUseCase {
    constructor(
        @inject(Types.IGroupRepository) private groupRepository: IGroupRepository,
        @inject(Types.IUnitOfWork) private unitOfWork: IUnitOfWork
    ) {}

    async execute(
        id: string): Promise<GroupResponseDTO> {
        try {
            await this.unitOfWork.beginTransaction();
            const group= await this.groupRepository.findById(id)
            if(!group){
                throw new Error("Group not found")
            }
            const updated = await this.groupRepository.update(id,{status:"DISUELTO",memberCount:0});
            await this.unitOfWork.commit();
            return GroupResponseDTO.fromEntity(updated);
        } catch (error) {
            console.log(error);
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}