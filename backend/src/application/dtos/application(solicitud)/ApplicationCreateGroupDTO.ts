export class ApplicationCreateGroupDTO {
  constructor(
    public readonly groupName: string,
    public readonly debut: Date,
    public readonly status: string,
    public readonly members: number[],
    public readonly roles: string[],
    public readonly agencyId: number,
    public readonly conceptId: number,
    public readonly visualConceptId: number,
    public readonly memberCount: number,
    public readonly apprentices: number[],
    public readonly artists: [number, number][] // [idAp, oldGroupId]
  ) {}

  /**
   * Convierte una entidad de Application (o cualquier objeto parecido)
   * en un DTO seguro para crear un grupo.
   */
  static fromApplication(app: any): ApplicationCreateGroupDTO {
    // 🔹 Aprendices: filtrar y convertir a número válido
    const apprenticeIds: number[] = Array.isArray(app.apprentices)
      ? app.apprentices
          .map((id: any) => Number(id))
          .filter((id: number) => !isNaN(id))
      : [];

    // 🔹 Artistas: array de tuplas [idAp, oldGroupId]
    const artistTuples: [number, number][] = Array.isArray(app.artists)
      ? app.artists
          .map((a: any) => {
            if (!a) return null;

            // Caso objeto { idApprentice, groupId } o { idAp, idGr }
            if (typeof a === "object" && !Array.isArray(a)) {
              const idAp = Number(a.idApprentice ?? a.idAp);
              const oldGroupId = Number(a.groupId ?? a.idGr);
              if (!isNaN(idAp) && !isNaN(oldGroupId)) return [idAp, oldGroupId] as [number, number];
            }

            // Caso tupla [idAp, oldGroupId]
            if (Array.isArray(a) && a.length === 2) {
              const idAp = Number(a[0]);
              const oldGroupId = Number(a[1]);
              if (!isNaN(idAp) && !isNaN(oldGroupId)) return [idAp, oldGroupId] as [number, number];
            }

            return null;
          })
          .filter((t: [number, number]): t is [number, number] => t !== null)
      : [];

    // 🔹 Miembros combinados (para roles y conteo)
    const members: number[] = [
      ...apprenticeIds,
      ...artistTuples.map(([idAp]) => idAp)
    ];

    return new ApplicationCreateGroupDTO(
      String(app.groupName ?? "Grupo Sin Nombre"),
      new Date(app.debut ?? app.date ?? Date.now()),
      String(app.status ?? "PENDIENTE"),
      members,
      Array.isArray(app.roles) ? app.roles.map((r: any) => String(r)) : [],
      Number(app.agencyId ?? app.idAgency ?? 1),
      Number(app.conceptId ?? app.idConcept ?? 1),
      Number(app.visualConceptId ?? app.idVisualConcept ?? 1),
      members.length,
      apprenticeIds,
      artistTuples
    );
  }
}