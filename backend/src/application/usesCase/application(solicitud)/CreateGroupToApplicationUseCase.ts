import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";

import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import type { GroupResponseDTO } from "../../dtos/group/GroupResponseDTO";
import { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";
import type { Group } from "../../../domain/entities/Group";


@injectable()
export class CreateGroupToApplicationUseCase {

  constructor(
    @inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository,
  ) {}

  async execute(applicationId: string): Promise<Group> {

    // 1️⃣ Obtener la solicitud
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new Error("Application not found");

    // 2️⃣ Convertir artists → solo IDs
    const artistIds = app.artists.map(([idArtist]) => Number(idArtist));

    // 3️⃣ Combinar apprentices + artists como miembros
    const members = [
      ...app.apprentices.map(a => Number(a)),
      ...artistIds
    ];

    // 4️⃣ Construir el DTO EXACTO como tu constructor exige
    const dto = new CreateGroupDTO(
      app.groupName,
      new Date(app.date),      // debut
      app.status,              // status del application
      members.length,          // memberCount
      Number(app.idAgency),
      Number(app.idConcept),
      1,
      members,                 // members
      app.roles,               // roles (misma cantidad que miembros)
      [],
      []
    );

    const createdGroup = await this.applicationRepository.createGroup(dto,app.id);

    return createdGroup
    
        
}
}