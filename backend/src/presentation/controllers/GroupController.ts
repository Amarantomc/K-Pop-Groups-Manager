import { inject, injectable } from "inversify";
import type { Request, Response } from "express";
import { Types } from "../../infrastructure/di/Types";
import { CreateGroupDTO } from "../../application/dtos/group/CreateGroupDTO";
import { GroupResponseDTO } from "../../application/dtos/group/GroupResponseDTO";
import { CreateGroupUseCase } from "../../application/usesCase/group/CreateGroupUseCase";
import { GetGroupUseCase } from "../../application/usesCase/group/GetGroupUseCase";
import { ListGroupsUseCase } from "../../application/usesCase/group/ListGroupsUseCase";
import { UpdateGroupUseCase } from "../../application/usesCase/group/UpdateGroupUseCase";
import { DeleteGroupUseCase } from "../../application/usesCase/group/DeleteGroupUseCase";
import { AddMembersUseCase } from "../../application/usesCase/group/AddMembersUseCase";
import { RemoveMembersUseCase } from "../../application/usesCase/group/RemoveMembersUseCase";
import { AddAlbumsUseCase } from "../../application/usesCase/group/AddAlbumsUseCase";
import { AddActivitiesUseCase } from "../../application/usesCase/group/AddActivitiesUseCase";
import { FindGroupByNameUseCase } from "../../application/usesCase/group/FindGroupByNameUseCase";
import { FindGroupByDebutUseCase } from "../../application/usesCase/group/FindGroupByDebutUseCase";
import { FindGroupsByStatusUseCase } from "../../application/usesCase/group/FindGroupsByStatusUseCase";
import { FindGroupsByMemberCountUseCase } from "../../application/usesCase/group/FindGroupsByMemberCountUseCase";
import { FindGroupsByMemberUseCase } from "../../application/usesCase/group/FindGroupsByMemberUseCase";
import { FindGroupsByAgencyUseCase } from "../../application/usesCase/group/FindGroupsByAgencyUseCase";
import { FindGroupsByConceptUseCase } from "../../application/usesCase/group/FindGroupsByConceptUseCase";
import { FindGroupByVisualConceptUseCase } from "../../application/usesCase/group/FindGroupByVisualConceptUseCase";

@injectable()
export class GroupController {
	constructor(
		@inject(Types.CreateGroupUseCase)
		private createGroupUseCase: CreateGroupUseCase,
		@inject(Types.GetGroupUseCase) private getGroupUseCase: GetGroupUseCase,
		@inject(Types.ListGroupsUseCase)
		private listGroupsUseCase: ListGroupsUseCase,
		@inject(Types.UpdateGroupUseCase)
		private updateGroupUseCase: UpdateGroupUseCase,
		@inject(Types.DeleteGroupUseCase)
		private deleteGroupUseCase: DeleteGroupUseCase,
		@inject(Types.AddMembersUseCase)
		private addMembersUseCase: AddMembersUseCase,
		@inject(Types.RemoveMembersUseCase)
		private removeMembersUseCase: RemoveMembersUseCase,
		@inject(Types.AddAlbumsUseCase) private addAlbumsUseCase: AddAlbumsUseCase,
		@inject(Types.AddActivitiesUseCase)
		private addActivitiesUseCase: AddActivitiesUseCase,
		@inject(Types.FindGroupsByNameUseCase)
		private findGroupByNameUseCase: FindGroupByNameUseCase,
		@inject(Types.FindGroupsByDebutUseCase)
		private findGroupByDebutUseCase: FindGroupByDebutUseCase,
		@inject(Types.FindGroupsByStatusUseCase)
		private findGroupsByStatusUseCase: FindGroupsByStatusUseCase,
		@inject(Types.FindGroupsByMemberCountUseCase)
		private findGroupsByMemberCountUseCase: FindGroupsByMemberCountUseCase,
		@inject(Types.FindGroupsByMemberUseCase)
		private findGroupsByMemberUseCase: FindGroupsByMemberUseCase,
		@inject(Types.FindGroupsByAgencyUseCase)
		private findGroupsByAgencyUseCase: FindGroupsByAgencyUseCase,
		@inject(Types.FindGroupsByConceptUseCase)
		private findGroupsByConceptUseCase: FindGroupsByConceptUseCase,
		@inject(Types.FindGroupsByVisualConceptUseCase)
		private findGroupByVisualConceptUseCase: FindGroupByVisualConceptUseCase
	) {}

	async createGroup(req: Request, res: Response) {
		try {
			const groupDto = CreateGroupDTO.Create(req.body);
			const group = await this.createGroupUseCase.execute(groupDto);
			res.status(201).json({ success: true, data: group });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async getGroup(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const group = await this.getGroupUseCase.execute(id!);
			res.json({ success: true, data: group });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}

	async listGroups(req: Request, res: Response) {
		try {
			const groups = await this.listGroupsUseCase.execute();
			res.json({ success: true, data: groups });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	}

	async updateGroup(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const group = await this.updateGroupUseCase.execute(id!, req.body);
			res.json({ success: true, data: group });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async deleteGroup(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await this.deleteGroupUseCase.execute(id!);
			res.json({ success: true, message: "Group deleted successfully" });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async addMembers(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { members } = req.body;

			if (!Array.isArray(members) || members.length === 0) {
				return res
					.status(400)
					.json({ success: false, error: "members must be a non-empty array" });
			}

			const group = await this.addMembersUseCase.execute(id!, members);
			res.json({ success: true, data: group });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async removeMembers(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { members } = req.body;

			if (!Array.isArray(members) || members.length === 0) {
				return res
					.status(400)
					.json({ success: false, error: "members must be a non-empty array" });
			}

			const group = await this.removeMembersUseCase.execute(id!, members);
			res.json({ success: true, data: group });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async addAlbums(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { albums } = req.body;

			if (!Array.isArray(albums) || albums.length === 0) {
				return res
					.status(400)
					.json({ success: false, error: "albums must be a non-empty array" });
			}

			const group = await this.addAlbumsUseCase.execute(id!, albums);
			res.json({ success: true, data: group });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async addActivities(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { activities } = req.body;

			if (!Array.isArray(activities) || activities.length === 0) {
				return res.status(400).json({
					success: false,
					error: "activities must be a non-empty array",
				});
			}

			const group = await this.addActivitiesUseCase.execute(id!, activities);
			res.json({ success: true, data: group });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findGroupByName(req: Request, res: Response) {
		try {
			const { name } = req.query;
			if (!name || typeof name !== "string") {
				return res
					.status(400)
					.json({ success: false, error: "name query parameter is required" });
			}
			const group = await this.findGroupByNameUseCase.execute(name);
			res.json({ success: true, data: group });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}

	async findGroupByDebut(req: Request, res: Response) {
		try {
			const { debut } = req.query;
			if (!debut || typeof debut !== "string") {
				return res
					.status(400)
					.json({ success: false, error: "debut query parameter is required" });
			}
			const group = await this.findGroupByDebutUseCase.execute(new Date(debut));
			res.json({ success: true, data: group });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}

	async findGroupsByStatus(req: Request, res: Response) {
		try {
			const { status } = req.query;
			if (!status || typeof status !== "string") {
				return res
					.status(400)
					.json({
						success: false,
						error: "status query parameter is required",
					});
			}
			const groups = await this.findGroupsByStatusUseCase.execute(
				status as any
			);
			res.json({ success: true, data: groups });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findGroupsByMemberCount(req: Request, res: Response) {
		try {
			const { count } = req.query;
			if (!count || typeof count !== "string") {
				return res.status(400).json({
					success: false,
					error: "count query parameter is required",
				});
			}
			const groups = await this.findGroupsByMemberCountUseCase.execute(
				parseInt(count)
			);
			res.json({ success: true, data: groups });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findGroupsByMember(req: Request, res: Response) {
		try {
			const { memberId } = req.query;
			if (!memberId || typeof memberId !== "string") {
				return res.status(400).json({
					success: false,
					error: "memberId query parameter is required",
				});
			}
			const groups = await this.findGroupsByMemberUseCase.execute(
				parseInt(memberId)
			);
			res.json({ success: true, data: groups });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findGroupsByAgency(req: Request, res: Response) {
		try {
			const { agencyId } = req.query;
			if (!agencyId || typeof agencyId !== "string") {
				return res.status(400).json({
					success: false,
					error: "agencyId query parameter is required",
				});
			}
			const groups = await this.findGroupsByAgencyUseCase.execute(
				parseInt(agencyId)
			);
			res.json({ success: true, data: groups });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findGroupsByConcept(req: Request, res: Response) {
		try {
			const { conceptId } = req.query;
			if (!conceptId || typeof conceptId !== "string") {
				return res.status(400).json({
					success: false,
					error: "conceptId query parameter is required",
				});
			}
			const groups = await this.findGroupsByConceptUseCase.execute(
				parseInt(conceptId)
			);
			res.json({ success: true, data: groups });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	async findGroupByVisualConcept(req: Request, res: Response) {
		try {
			const { visualConceptId } = req.query;
			if (!visualConceptId || typeof visualConceptId !== "string") {
				return res.status(400).json({
					success: false,
					error: "visualConceptId query parameter is required",
				});
			}
			const groups = await this.findGroupByVisualConceptUseCase.execute(
				parseInt(visualConceptId)
			);
			res.json({ success: true, data: groups });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}
}
