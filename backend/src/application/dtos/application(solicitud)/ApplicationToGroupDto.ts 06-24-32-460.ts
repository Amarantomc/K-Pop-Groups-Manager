import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";

import type { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import type { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { GroupResponseDTO } from "../group/GroupResponseDTO";
import { CreateGroupDTO } from "../group/CreateGroupDTO";


@injectable()
export class CreateGroupToApplicationUseCase {

  constructor(
    @inject(Types.IApplicationRepository) private applicationRepository: IApplicationRepository,
    @inject(Types.IGroupRepository) private groupRepository: IGroupRepository
  ) {}

  async execute(applicationId: string): Promise<GroupResponseDTO> {

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

    // 5️⃣ Crear el grupo en la base de datos
    const createdGroup = await this.groupRepository.create(dto);

    // 6️⃣ Devolver la respuesta DTO
    return new GroupResponseDTO(
      createdGroup.id,
      createdGroup.name,
      createdGroup.debut,
      createdGroup.status,
      createdGroup.memberCount,
      createdGroup.IdAgency,
      createdGroup.IdConcept,
      createdGroup.IdVisualConcept,
      createdGroup.members,
      createdGroup.roles,
      createdGroup.albums,
      createdGroup.activities
    );
  }
}