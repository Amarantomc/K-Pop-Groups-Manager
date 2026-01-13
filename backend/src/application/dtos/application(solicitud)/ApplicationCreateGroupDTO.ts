
export class ApplicationCreateGroupDTO {
  constructor(
    public readonly groupName: string,
    public readonly debut: Date,
    public readonly status: string,
    public readonly members: number[],
    public readonly agencyId: number,
    public readonly conceptId: number,
    public readonly visualConceptId: number,
    public readonly memberCount: number,
    public readonly apprentices: Array<[number, string]>,           // [idAp, rol]
    public readonly artists: Array<[number, number, string]>        // [idAp, oldGroupId, rol]
  ) {}

  /**
   * Convierte una Application en un DTO seguro para crear un grupo
   */
  static fromApplication(app: any): ApplicationCreateGroupDTO {
    const DEFAULT_ROLE = "MIEMBRO";

    // APRENDICES
    const apprentices: Array<[number, string]> = Array.isArray(app.apprentices)
      ? app.apprentices
          .map((a: any) => {
            // objeto { idAp, rol }
            if (typeof a === "object" && !Array.isArray(a)) {
              const idAp = Number(a.idAp ?? a.idApprentice);
              const rol = String(a.rol ?? DEFAULT_ROLE);
              if (!isNaN(idAp)) return [idAp, rol];
            }

            // tupla [idAp, rol]
            if (Array.isArray(a) && a.length >= 1) {
              const idAp = Number(a[0]);
              const rol = String(a[1] ?? DEFAULT_ROLE);
              if (!isNaN(idAp)) return [idAp, rol];
            }

            return null;
          })
          .filter((a: any): a is [number, string] => a !== null)
      : [];

    // ======================
    // ARTISTAS
    // ======================
    const artists: Array<[number, number, string]> = Array.isArray(app.artists)
      ? app.artists
          .map((a: any) => {
            // objeto { idAp, idGr, rol }
            if (typeof a === "object" && !Array.isArray(a)) {
              const idAp = Number(a.idAp ?? a.idApprentice);
              const idGr = Number(a.idGr ?? a.groupId);
              const rol = String(a.rol ?? DEFAULT_ROLE);

              if (!isNaN(idAp) && !isNaN(idGr)) {
                return [idAp, idGr, rol];
              }
            }

            // tupla [idAp, idGr, rol?]
            if (Array.isArray(a) && a.length >= 2) {
              const idAp = Number(a[0]);
              const idGr = Number(a[1]);
              const rol = String(a[2] ?? DEFAULT_ROLE);

              if (!isNaN(idAp) && !isNaN(idGr)) {
                return [idAp, idGr, rol];
              }
            }

            return null;
          })
          .filter((a: any): a is [number, number, string] => a !== null)
      : [];

    // ======================
    // MIEMBROS (ids únicos)
    // ======================
    const members = [
      ...apprentices.map(([idAp]) => idAp),
      ...artists.map(([idAp]) => idAp),
    ];

    return new ApplicationCreateGroupDTO(
      String(app.groupName ?? "Grupo Sin Nombre"),
      new Date(app.debut ?? Date.now()),
      String(app.status ?? "PENDIENTE"),
      members,
      Number(app.agencyId ?? app.idAgency),
      Number(app.conceptId ?? app.idConcept),
      Number(app.visualConceptId ?? app.idVisualConcept),
      members.length,
      apprentices,
      artists
    );
  }
}