import { CreateAlbumUseCase } from "../../application/usesCase/album/CreateAlbumUseCase";
import type { DeleteAlbumUseCase } from "../../application/usesCase/album/DeleteAlbumUseCAse";
import { FindAlbumByTitleUseCase } from "../../application/usesCase/album/FindByTitleUseCase";
import type { GetAlbumUseCase } from "../../application/usesCase/album/GetAlbumUseCase";
import type { UpdateAlbumUseCase } from "../../application/usesCase/album/UpdateAlbumUseCase";
import { PopularityList } from "../../domain";
import { AlbumController } from "../../presentation/controllers/AlbumController";

// src/infrastructure/di/TYPES.ts
const Types = {
	// Database
	PrismaClient: Symbol.for("PrismaClient"),

	//  Interfaces
	IUnitOfWork: Symbol.for("IUnitOfWork"),
	IUserRepository: Symbol.for("IUserRepository"),
	IApprenticeRepository: Symbol.for("IApprenticeRepository"),
	IAgencyRepository: Symbol.for("IAgencyRepository"),
	IArtistRepository: Symbol.for("IArtistRepository"),
	IConceptRepository: Symbol.for("IConceptRepository"),
	IActivityRepository: Symbol.for("IActivityRepository"),
	IAlbumRepository: Symbol.for("IAlbumRepository"),

	IPopularityListRepository: Symbol.for("IPopularityListRepository"),

	// Application Use Cases
	CreateUserUseCase: Symbol.for("CreateUserUseCase"),
	GetUserUseCase: Symbol.for("GetUserUseCase"),
	GetUsersUseCase: Symbol.for("GetUsersUseCase"),
	UpdateUserUseCase: Symbol.for("UpdateUserUseCase"),
	DeleteUserUseCase: Symbol.for("DeleteUserUseCase"),

	CreateApprenticeUseCase: Symbol.for("CreateApprenticeUseCase"),
	DeleteApprenticeUseCase: Symbol.for("DeleteApprenticeUseCase"),
	GetApprenticeUseCase: Symbol.for("GetApprenticeUseCase"),
	UpdateApprenticeUseCase: Symbol.for("UpdateApprenticeUseCase"),
	ListApprenticeUseCase: Symbol.for("ListApprenticeUseCase"),
	ListByAgencyUseCase: Symbol.for("ListByAgencyUseCase"),
	GetApprenticeByNameUseCase: Symbol.for("GetApprenticeByNameUseCase"),

	CreateAgencyUseCase: Symbol.for("CreateAgencyUseCase"),
	DeleteAgencyUseCase: Symbol.for("DeleteAgencyUseCase"),
	FindAgenciesByAddressUseCase: Symbol.for(" FindAgenciesByAddressUseCase"),
	FindAgenciesByFoundationUseCase: Symbol.for(
		"FindAgenciesByFoundationUseCase"
	),
	FindAgenciesByNameUseCase: Symbol.for("FindAgenciesByNameUseCase"),
	GetAgencyUseCase: Symbol.for("GetAgencyUseCase"),
	UpdateAgencyUseCase: Symbol.for("UpdateAgencyUseCase"),
	ListAgenciesUseCase: Symbol.for("ListAgenciesUseCase"),

	CreateArtistUseCase: Symbol.for("CreateArtistUseCase"),
	DeleteArtistUseCase: Symbol.for("DeleteArtistUseCase"),
	UpdateArtistUseCase: Symbol.for("UpdateArtistUseCase"),
	FindArtistByIdUseCase: Symbol.for("FindArtistByIdUseCase"),
	GetAllArtistsUseCase: Symbol.for("GetAllArtistsUseCase"),
	FindArtistByAgencyUseCase: Symbol.for("FindArtistByAgencyUseCase"),

	CreateConceptUseCase: Symbol.for("CreateConceptUseCase"),
	DeleteConceptUseCase: Symbol.for("DeleteConceptUseCase"),
	GetConceptUseCase: Symbol.for("GetConceptUseCase"),
	UpdateConceptUseCase: Symbol.for("UpdateConceptUseCase"),
	ListConceptUseCase: Symbol.for("ListConceptUseCase"),

	CreatePopularityListUseCase: Symbol.for("CreatePopularityListUseCase"),
	GetPopularityListUseCase: Symbol.for("GetPopularityListUseCase"),
	ListPopularityListsUseCase: Symbol.for("GetPopularityListsUseCase"),
	UpdatePopularityListUseCase: Symbol.for("UpdatePopularityListUseCase"),
	DeletePopularityListUseCase: Symbol.for("DeletePopularityListUseCase"),
	AddSongToPopularityListUseCase: Symbol.for("AddSongToPopularityListUseCase"),

	LoginUserUseCase: Symbol.for("LoginUserUseCase"),
	ValidateTokenUseCase: Symbol.for("ValidateTokenUseCase"),

	CreateActivityUseCase: Symbol.for("CreateActivityUseCase"),
	UpdateActivityUseCase: Symbol.for("UpdateActivityUseCase"),
	DeleteActivityUseCase: Symbol.for("DeleteActivityUseCase"),
	FindActivityByIdUseCase: Symbol.for("FindActivityByIdUseCase"),
	GetAllActivitiesUseCase: Symbol.for("GetAllActivitiesUseCase"),
	FindActivitiesByArtist: Symbol.for("FindActivitiesByArtist"),
	AddArtistToActivityUseCase: Symbol.for("AddArtistToActivityUseCase"),

	CreateAlbumUseCase: Symbol.for("CreateAlbumUseCase"),
	DeleteAlbumUseCase: Symbol.for("DeleteAlbumUseCase"),
	GetAlbumUseCase: Symbol.for("GetAlbumUseCase"),
	UpdateAlbumUseCase: Symbol.for("UpdateAlbumUseCase"),
	ListAlbumsUseCase: Symbol.for("ListAlbumsUseCase"),
	FindAlbumByTitleUseCase: Symbol.for("FindAlbumByTitleUseCase"),

	// Presentation
	UserController: Symbol.for("UserController"),
	AuthController: Symbol.for("AuthController"),
	ApprenticeController: Symbol.for("ApprenticeController"),
	AgencyController: Symbol.for("AgencyController"),
	ArtistController: Symbol.for("ArtistController"),
	ConceptController: Symbol.for("ConceptController"),
	ActivityController: Symbol.for("ActivityController"),
	PopularityListController: Symbol.for("PopularityListController"),
	AlbumController: Symbol.for("AlbumController"),
};

export { Types };
