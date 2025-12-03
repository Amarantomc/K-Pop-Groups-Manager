import { GroupStatus } from "../../../domain/enums/GroupStatus";

export class CreateGroupDTO {
	constructor(
		public readonly name: string,
		public readonly debut: Date,
		public readonly status: string,
		public readonly memberCount: number,
		public readonly IdAgency: number,
		public readonly IdConcept: number,
		public readonly IdVisualConcept: number,
		public readonly members: number[],
		public readonly roles: string[],
		public readonly albums?: number[],
		public readonly activities?: number[]
	) {}

	static Create(body: any): CreateGroupDTO {
		
		if(!body.name|| !body.debut|| !body.status|| !body.IdAgency|| !body.IdConcept|| !body.IdVisualConcept|| !body.members|| !body.roles){
			throw new Error("Missing required fields");
		}
		
		if (!(body.status in GroupStatus)){
			throw new Error("Invalid group status");
		} 
		 
		if (!Array.isArray(body.members) ||body.members.length == 0|| !Array.isArray(body.roles)||body.roles.length == 0){
			throw new Error("Group's members and roles must be non-empty arrays");
		}
		 
		if (body.roles.length != body.members.length){
			throw new Error("Group member roles list must be the same length as member list");
		}


		return new CreateGroupDTO(
			body.name,
			new Date(body.debut),
			String(body.status),
			Number(body.members.length),
			Number(body.IdAgency),
			Number(body.IdConcept),
			Number(body.IdVisualConcept),
			body.members.map((member: any) => Number(member)),
			body.roles.map((role: any) => String(role)),
			body.albums?.map((album: any) => Number(album)),
			body.activities?.map((activity: any) => Number(activity))
		);
	}
}
