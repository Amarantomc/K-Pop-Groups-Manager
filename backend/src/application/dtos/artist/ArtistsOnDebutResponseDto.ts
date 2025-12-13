
export class ArtistOnDebutResponseDto {
    readonly apprenticeId: number;
    readonly groupId: number;
    readonly artistName: string;
    readonly debutDate: Date;
     readonly status: string;
    readonly   group: {
    name: string;
    debutDate: Date;
    status: string;
  };

    readonly contract: {
    startDate: Date;
    status: string;
    initialConditions: string;
    incomeDistribution: string;
  };
      constructor(
    apprenticeId: number,
    groupId: number,
    artistName: string,
    debutDate: Date,
    status: string,
    group: { name: string; debutDate: Date; status: string },
    
    contract: { startDate: Date; status: string; initialConditions: string; incomeDistribution: string },
     
  ) {
    this.apprenticeId = apprenticeId;
    this.groupId = groupId;
    this.artistName = artistName;
    this.debutDate = debutDate;
    this.status = status;
    this.group = group;
     
    this.contract = contract;
     
  }

    static fromQueryResult(artist:any):ArtistOnDebutResponseDto{
        return new ArtistOnDebutResponseDto(
      artist.idAp,
      artist.idGr,
      artist.nombreArtistico,
      new Date(artist.fechaDebut),
      artist.estadoArtista,
      {
        name: artist.grupoNombre,
        debutDate: new Date(artist.grupoFechaDebut),
        status: artist.estadoGrupo
      },
      
      {
        startDate: new Date(artist.contratoFechaInicio),
        status: artist.contratoEstado,
        initialConditions: artist.condicionesIniciales,
        incomeDistribution: artist.distribucionIngresos
      } 
    );
    }

    static fromQueryResults(results: any[]): ArtistOnDebutResponseDto[] {
    return results.map(result => this.fromQueryResult(result));
  }
}