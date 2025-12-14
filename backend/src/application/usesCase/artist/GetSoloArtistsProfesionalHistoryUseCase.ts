import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IArtistRepository } from "../../interfaces/repositories/IArtistRepository";
import { GroupStatus } from "../../../domain/enums/GroupStatus";
import type { IAlbumRepository } from "../../interfaces/repositories/IAlbumRepository";
import type { Album } from "../../../domain";
import type { IPopularityListRepository } from "../../interfaces/repositories/IPopularityListRepository";
import type { IContractRepository } from "../../interfaces/repositories/IContractRepository";
import { ContractResponseDto } from "../../dtos/contract/ContractResponseDto";
import type { IActivityRepository } from "../../interfaces/repositories/IActivityRepository";
import { ActivityResponseDto } from "../../dtos/activity/ActivityResponseDto";

@injectable()
export class GetSoloArtistsProfesionalHistoryUseCase {
            constructor(@inject(Types.IArtistRepository)private artistRepository:IArtistRepository,
                        @inject(Types.IAlbumRepository)private albumRepository:IAlbumRepository,
                        @inject(Types.IPopularityListRepository)private popularityListRepository: IPopularityListRepository,
                         @inject(Types.IContractRepository)private contractRepository:IContractRepository,
                         @inject(Types.IActivityRepository)private activityRepository:IActivityRepository){}

            async execute():Promise<any>{
                let soloArtist= await this.artistRepository.getSoloArtists()
                if(!soloArtist){
                    throw new Error("No solo artists found");
                }
                 
                 
                soloArtist=soloArtist.filter(artist=>{
                     
                    const disolved=artist.GroupHistory?.some(history=>history.status.toString()=='Disolved')
                     return disolved
                })
                 
                const albumPromises=soloArtist.map(a=>
                    this.albumRepository.getByArtist(a.ApprenticeId,a.GroupId)
                )
                const albumsResult= await Promise.all(albumPromises)
                 

                        // Filtrar álbumes donde todas las canciones alcanzaron top 100 en Billboard
        const validAlbumsPromises = albumsResult.flat().filter(Boolean).map(async (album) => {
            if (!album || !album.songs || album.songs.length === 0) {
                return null;
            }

            const albumReleaseYear = new Date(album.releaseDate).getFullYear();
            const targetYear = albumReleaseYear + 1;

            // Verificar cada canción del álbum
            const songChecks = await Promise.all(
                album.songs.map(async (song) => {
                    try {
                        const popularityLists = await this.popularityListRepository.findBySongId(song.id);
                        
                        // Verificar si la canción está en top 100 de Billboard (internacional o nacional)
                        const isInTop100 = popularityLists.some(list => {
                            // Verificar que sea Billboard (internacional o nacional)
                            const isBillboard = list.listType === 'Billboard Internacional' || 
                                              list.listType === 'Billboard Nacional';
                            
                            if (!isBillboard) return false;

                            // Verificar que haya una entrada para el año objetivo
                            const songInList = list.songs?.find(s => s.id === song.id);
                            if (!songInList) return false;

                            // Verificar año y posición top 100
                            return songInList.year === targetYear && songInList.position <= 100;
                        });

                        return isInTop100;
                    } catch (error) {
                        return false;
                    }
                })
            );

            // Todas las canciones deben cumplir la condición
            const allSongsInTop100 = songChecks.every(check => check === true);
            return allSongsInTop100 ? album : null;
        }); 

        let validAlbums = (await Promise.all(validAlbumsPromises)).filter(Boolean);
         
                 
                
        soloArtist=soloArtist.filter(artist=>{
                    const hasAlbum=validAlbums.some((album)=>album?.artists[0]?.idAp==artist.ApprenticeId && album.artists[0]?.idGr==artist.GroupId && album.noCopiesSold>1000000)
                      
                    return hasAlbum
                })
        const artistsWithHistory = await Promise.all(
            soloArtist.map(async (artist) => {
                // Obtener álbumes válidos del artista
                const artistAlbums = validAlbums.filter(
                    album => album?.artists[0]?.idAp === artist.ApprenticeId && 
                             album?.artists[0]?.idGr === artist.GroupId &&
                             album.noCopiesSold > 1000000
                );

                const contracts= await this.contractRepository.findByArtist(artist.ApprenticeId,artist.GroupId)
                const contractsDto=contracts? ContractResponseDto.fromEntities(contracts):[]
                const activities =await this.activityRepository.findByArtist(artist.ApprenticeId,artist.GroupId)
                const activitiesDto=activities? ActivityResponseDto.fromEntities(activities):[]
                return {
                    artist: artist,
                    albums: artistAlbums,
                    groupHistory: artist.GroupHistory,
                    contracts:contractsDto,
                    activities:activitiesDto,
                    totalAlbumsSold: artistAlbums.reduce((sum, album) => sum + (album?.noCopiesSold || 0), 0)
                };
            })
        );
         
         
         return artistsWithHistory;
                

            }
    }