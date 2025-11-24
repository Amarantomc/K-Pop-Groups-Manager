// src/infrastructure/di/TYPES.ts
const Types = {
	// Database
	PrismaClient: Symbol.for("PrismaClient"),

	//  Interfaces
	IUnitOfWork: Symbol.for("IUnitOfWork"),
	IUserRepository: Symbol.for("IUserRepository"),
	IApprenticeRepository: Symbol.for("IApprenticeRepository"),
	IAgencyRepository: Symbol.for("IAgencyRepository"),
	IGroupRepository: Symbol.for("IGroupRepository"),

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

	CreateGroupUseCase: Symbol.for("CreateGroupUseCase"),
	DeleteGroupUseCase: Symbol.for("DeleteGroupUseCase"),
	FindGroupsByNameUseCase: Symbol.for("FindGroupsByNameUseCase"),
	FindGroupsByDebutUseCase: Symbol.for("FindGroupsByDebutUseCase"),
	FindGroupsByStatusUseCase: Symbol.for("FindGroupsByStatusUseCase"),
	FindGroupsByMemberCountUseCase: Symbol.for("FindGroupsByMemberCountUseCase"),
	FindGroupsByMemberUseCase: Symbol.for("FindGroupsByMemberUseCase"),
	FindGroupsByAgencyUseCase: Symbol.for("FindGroupsByAgencyUseCase"),
	FindGroupsByConceptUseCase: Symbol.for("FindGroupsByConceptUseCase"),
	FindGroupsByVisualConceptUseCase: Symbol.for("FindGroupsByVisualConceptUseCase"),
	GetGroupUseCase: Symbol.for("GetGroupUseCase"),
	UpdateGroupUseCase: Symbol.for("UpdateGroupUseCase"),
	ListGroupsUseCase: Symbol.for("ListGroupsUseCase"),
	AddMembersUseCase: Symbol.for("AddMembersUseCase"),
	RemoveMembersUseCase: Symbol.for("RemoveMembersUseCase"),
	AddAlbumsUseCase: Symbol.for("AddAlbumsUseCase"),
	AddActivitiesUseCase: Symbol.for("AddActivitiesUseCase"),

	LoginUserUseCase: Symbol.for("LoginUserUseCase"),
	ValidateTokenUseCase: Symbol.for("ValidateTokenUseCase"),

	// Presentation
	UserController: Symbol.for("UserController"),
	AuthController: Symbol.for("AuthController"),
	ApprenticeController: Symbol.for("ApprenticeController"),
	AgencyController: Symbol.for("AgencyController"),
	GroupController: Symbol.for("GroupController"),
};

export { Types };
