import { CreateGroupDTO } from "../../dtos/group/CreateGroupDTO";
import type Application from "../../../domain/entities/Application";

export function ApplicationToGroupDto(app: Application): CreateGroupDTO {

    // members = apprentices + artists.ids
    const members = [
        ...app.apprentices,
        ...app.artists.map(([idArtist]) => idArtist)
    ];

    // roles deben tener EL MISMO largo que members
    const roles = [
        ...app.apprentices.map(() => "Aprendiz"),
        ...app.artists.map(([_, role]) => String(role))
    ];

    if(roles.length !== members.length){
        throw new Error("Invalid number of members; there are not the same number of roles as members");
    }

    return new CreateGroupDTO(
        app.groupName,               // name
        new Date(),                  // debut date
        "Activo",                    // group status inicial
        members.length,              // memberCount
        app.idAgency,                // IdAgency
        app.idConcept,               // IdConcept
        1,                           // IdVisualConcept (ej: default =1)
        members,                     // members array
        roles,                       // aligned roles
        [],                          // albums
        []                           // activities
    );
}