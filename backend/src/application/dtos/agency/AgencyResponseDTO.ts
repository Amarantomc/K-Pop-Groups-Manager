import { Agency } from "../../../domain/entities/Agency";

export class AgencyResponseDTO {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly address: string,
		public readonly foundation: Date
	) {}

	static fromEntity(agency: any): AgencyResponseDTO {
		
		return new AgencyResponseDTO(
			agency.id,
			agency.name,
			agency.address,
			agency.foundation
		);
	}

	static toEntity(agency: any): Agency {
		 
		return new Agency({
			id: agency.id,
			name: agency.nombre,
			address: agency.ubicacion,
			foundation: agency.fechaFundacion,
		});
	}

	static fromEntities(agencies: any[]): AgencyResponseDTO[] {
		return agencies.map((agency) => this.fromEntity(agency));
	}
}
