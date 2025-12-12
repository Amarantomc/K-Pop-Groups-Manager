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

    // Para repository
    public readonly apprentices: number[],
    public readonly artists: [number, number][] // [idAp, oldGroupId]
  ) {}

  static fromApplication(app: any): ApplicationCreateGroupDTO {
    const apprenticeIds: number[] = app.apprentices ?? [];
    const artistTuples: [number, number][] = app.artists ?? [];
  
    const members: number[] = [
      ...apprenticeIds,
      ...artistTuples.map(([idAp]) => idAp)
    ];
  
    return new ApplicationCreateGroupDTO(
      app.groupName,                // groupName
      new Date(app.date),           // debut
      app.status,                   // status
      members,                      // members
      app.roles ?? [],              // roles
      Number(app.idAgency),         // agencyId
      Number(app.idConcept),        // conceptId
      Number(app.idVisualConcept ?? 1), // visualConceptId
      members.length,               // memberCount
      apprenticeIds,                // apprentices
      artistTuples                  // artists
    );
  }
}