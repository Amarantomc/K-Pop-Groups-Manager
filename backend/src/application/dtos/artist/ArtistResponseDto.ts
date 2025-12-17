// import  { Artist } from "../../../domain/entities/Artist";
// import { AgencyResponseDTO } from "../agency/AgencyResponseDTO";
// import { GroupResponseDTO } from "../group/GroupResponseDTO";
 

// export class ArtistResponseDto {
//   constructor(
//     public readonly ApprenticeId: number,
//     public readonly GroupId: number,
//     public readonly ArtistName: string,
//     public readonly DebutDate: string,
//     public readonly Status: string,
//     public readonly groupHistory?:GroupResponseDTO[],
//     public readonly realName?: string,

//     // public readonly groupHistory?: Array<{
//     //   groupId: number;
//     //   role: string;
//     //   startDate: string;
//     //   endDate?: string;
//     // }>,
//     public  debutGroup?:{name:string},
    
//     public readonly contracts?: Array<{
//       agencyId: number;
//       startDate: string;
//       endDate?: string;
//       status: string;
//     }>,
//     public readonly activities?: Array<{
//       activityId: number;
//       accepted: boolean;
//     }>
//   ) {}

//   static fromEntity(artist: Artist): ArtistResponseDto {
    
//     return new ArtistResponseDto(
//       artist.ApprenticeId,
//       artist.GroupId,
//       artist.ArtistName,
//       artist.DebutDate.toDateString(),
//       artist.Status.toString(),
//       undefined,
//       artist.realName
      
//     );
//   }

//   static toEntity(artist: any): Artist {
//     return new Artist({
//       ApprenticeId: artist.idAp,
//       GroupId: artist.idGr,
//       ArtistName: artist.nombreArtistico,
//       DebutDate: artist.fechaDebut,
//       Status: artist.estadoArtista,
//       realName: artist.aprendiz?.nombreCompleto,
//     });
//   }
//   // static toEntity(artist:any):Artist {
      
    
//   //   return new Artist({ 
//   //     ApprenticeId:artist.idAp,
//   //     GroupId:artist.idGr,
//   //     ArtistName:artist.nombreArtistico,
//   //     DebutDate: artist.fechaDebut,
//   //     Status:artist.estadoArtista,
//   //     realName: artist.nombreCompleto
 
//   //     }
     
//   //   )
//   // }

//    static toEntityForManager(artist:any):Artist {
  
//     const agency=AgencyResponseDTO.toEntity(artist.aprendiz.Agencia[0].agencia)
//     const groups=GroupResponseDTO.toEntitiesSimple(artist.HistorialGrupos,agency)
    
    
//     return new Artist({ 
//       ApprenticeId:artist.idAp,
//       GroupId:artist.idGr,
//       ArtistName:artist.nombreArtistico,
//       DebutDate: artist.fechaDebut,
//       Status:artist.estadoArtista,
//       GroupHistory:groups
 
//       }
     
//     )
//   }

//   static fromEntities(artists: any[]): ArtistResponseDto[] {
//     return artists.map(artist => this.fromEntity(artist));
//   }

//    static toEntities(artists: any[]): Artist[] {
//     return artists.map(artist => this.toEntity(artist));
//   }

//    static toEntitiesForManager(artists: any[]): Artist[] {
//     return artists.map(artist => this.toEntityForManager(artist));
//   }

//   // static fromEntityForManager(artist: Artist): ArtistResponseDto {
    
//   //   const group=GroupResponseDTO.fromEntities(artist.GroupHistory!)
//   //   return new ArtistResponseDto(
//   //     artist.ApprenticeId,
//   //     artist.GroupId,
//   //     artist.ArtistName,
//   //     artist.DebutDate.toDateString(),
//   //     artist.Status.toString(),
//   //     group
       
      
//   //   );
  
//   // }

  
// }


import { Artist } from "../../../domain/entities/Artist";
import { GroupResponseDTO } from "../group/GroupResponseDTO";

export class ArtistResponseDto {
  static
    //     //   startDate: string;
    //     //   endDate?: string;
    //     // }>,
    //     public  debutGroup?:{name:string},
    //     public readonly contracts?: Array<{
    //       agencyId: number;
    //       startDate: string;
    //       endDate?: string;
    //       status: string;
    //     }>,
    //     public readonly activities?: Array<{
    //       activityId: number;
    //       accepted: boolean;
    //     }>
    //   ) {}
    //   static fromEntity(artist: Artist): ArtistResponseDto {
    //     return new ArtistResponseDto(
    //       artist.ApprenticeId,
    //       artist.GroupId,
    //       artist.ArtistName,
    //       artist.DebutDate.toDateString(),
    //       artist.Status.toString(),
    //       undefined,
    //       artist.realName
    //     );
    //   }
    //   static toEntity(artist: any): Artist {
    //     return new Artist({
    //       ApprenticeId: artist.idAp,
    //       GroupId: artist.idGr,
    //       ArtistName: artist.nombreArtistico,
    //       DebutDate: artist.fechaDebut,
    //       Status: artist.estadoArtista,
    //       realName: artist.aprendiz?.nombreCompleto,
    //     });
    //   }
    //   // static toEntity(artist:any):Artist {
    //   //   return new Artist({ 
    //   //     ApprenticeId:artist.idAp,
    //   //     GroupId:artist.idGr,
    //   //     ArtistName:artist.nombreArtistico,
    //   //     DebutDate: artist.fechaDebut,
    //   //     Status:artist.estadoArtista,
    //   //     realName: artist.nombreCompleto
    //   //     }
    //   //   )
    //   // }
    //    static toEntityForManager(artist:any):Artist {
    //     const agency=AgencyResponseDTO.toEntity(artist.aprendiz.Agencia[0].agencia)
    //     const groups=GroupResponseDTO.toEntitiesSimple(artist.HistorialGrupos,agency)
    //     return new Artist({ 
    //       ApprenticeId:artist.idAp,
    //       GroupId:artist.idGr,
    //       ArtistName:artist.nombreArtistico,
    //       DebutDate: artist.fechaDebut,
    //       Status:artist.estadoArtista,
    //       GroupHistory:groups
    //       }
    //     )
    //   }
    //   static fromEntities(artists: any[]): ArtistResponseDto[] {
    //     return artists.map(artist => this.fromEntity(artist));
    //   }
    //    static toEntities(artists: any[]): Artist[] {
    //     return artists.map(artist => this.toEntity(artist));
    //   }
    //    static toEntitiesForManager(artists: any[]): Artist[] {
    //     return artists.map(artist => this.toEntityForManager(artist));
    //   }
    //   // static fromEntityForManager(artist: Artist): ArtistResponseDto {
    //   //   const group=GroupResponseDTO.fromEntities(artist.GroupHistory!)
    //   //   return new ArtistResponseDto(
    //   //     artist.ApprenticeId,
    //   //     artist.GroupId,
    //   //     artist.ArtistName,
    //   //     artist.DebutDate.toDateString(),
    //   //     artist.Status.toString(),
    //   //     group
    //   //   );
    //   // }
    // }
    fromEntityForManager(artist: Artist): ArtistResponseDto | PromiseLike<ArtistResponseDto> {
      throw new Error("Method not implemented.");
  }
  constructor(
    public readonly ApprenticeId: number,
    public readonly GroupId: number,
    public readonly ArtistName: string,
    public readonly DebutDate: string,
    public readonly Status: string,
    public readonly agencyId: number,          // 🔥 NUEVO
    public readonly groupHistory?: GroupResponseDTO[],
    public readonly realName?: string,
  ) {}

  // ============================
  // Entity → Response DTO
  // ============================
  static fromEntity(artist: Artist): ArtistResponseDto {
    return new ArtistResponseDto(
      artist.ApprenticeId,
      artist.GroupId,
      artist.ArtistName,
      artist.DebutDate.toISOString(),
      artist.Status.toString(),
      artist.agencyId!,               // 🔥 aquí ya viene seteado
      artist.GroupHistory
        ? GroupResponseDTO.fromEntities(artist.GroupHistory)
        : undefined,
      artist.realName
    );
  }

  // ============================
  // Prisma → Domain (NORMAL)
  // ============================
  static toEntity(artist: any): Artist {
    const activeContract = artist.Contrato?.[0];

    return new Artist({
      ApprenticeId: artist.idAp,
      GroupId: artist.idGr,
      ArtistName: artist.nombreArtistico,
      DebutDate: artist.fechaDebut,
      Status: artist.estadoArtista,
      realName: artist.aprendiz?.nombreCompleto,
      agencyId: activeContract?.Agencia?.id, // 🔥 CLAVE
    });
  }

  // ============================
  // Prisma → Domain (MANAGER)
  // ============================
  static toEntityForManager(artist: any): Artist {
    const activeContract = artist.Contrato?.[0];

    const groups = GroupResponseDTO.toEntitiesSimple(
      artist.HistorialGrupos
    );

    return new Artist({
      ApprenticeId: artist.idAp,
      GroupId: artist.idGr,
      ArtistName: artist.nombreArtistico,
      DebutDate: artist.fechaDebut,
      Status: artist.estadoArtista,
      GroupHistory: groups,
      realName: artist.aprendiz?.nombreCompleto,
      agencyId: activeContract?.Agencia?.id, // 🔥 AQUÍ ESTÁ LA MAGIA
    });
  }

  // ============================
  // Helpers
  // ============================
  static fromEntities(artists: Artist[]): ArtistResponseDto[] {
    return artists.map(a => this.fromEntity(a));
  }

  static toEntities(artists: any[]): Artist[] {
    return artists.map(a => this.toEntity(a));
  }

  static toEntitiesForManager(artists: any[]): Artist[] {
    return artists.map(a => this.toEntityForManager(a));
  }
}