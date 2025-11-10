import { CreateAgencyUseCase } from "../../../../application/usesCase/agency/CreateAgencyUseCase";
import { GetAgencyUseCase } from "../../../../application/usesCase/agency/GetAgencyUseCase";
import { ListAgenciesUseCase } from "../../../../application/usesCase/agency/ListAgenciesUseCase";
import { UpdateAgencyUseCase } from "../../../../application/usesCase/agency/UpdateAgencyUseCase";
import { DeleteAgencyUseCase } from "../../../../application/usesCase/agency/DeleteAgencyUseCase";
import { Agency } from "../../../../domain/entities/Agency";
import { CreateAgencyDTO } from "../../../../application/dtos/agency/CreateAgencyDTO";
import { AgencyResponseDTO } from "../../../../application/dtos/agency/AgencyResponseDTO";
import type { IAgencyRepository } from "../../../../application/interfaces/repositories/IAgencyRepository";
import type { IUnitOfWork } from "../../../../application/interfaces/IUnitOfWork";

// Mock repository
class MockAgencyRepository implements IAgencyRepository {
	private agencies: Agency[] = [];

	async create(data: CreateAgencyDTO): Promise<Agency> {
		const id = this.agencies.length + 1;
		const agency = new Agency({
			id,
			name: data.name,
			address: data.address,
			foundation: data.foundation,
		});
		this.agencies.push(agency);
		return agency;
	}

	async findById(id: string): Promise<Agency | null> {
		const agency = this.agencies.find((a) => a.id === parseInt(id));
		return agency || null;
	}

	async update(id: string, data: any): Promise<Agency> {
		const index = this.agencies.findIndex((a) => a.id === parseInt(id));
		if (index === -1) throw new Error("Agency not found");

		const updated = new Agency({
			id: parseInt(id),
			name: data.name || this.agencies[index].name,
			address: data.address || this.agencies[index].address,
			foundation: data.foundation || this.agencies[index].foundation,
		});

		this.agencies[index] = updated;
		return updated;
	}

	async delete(id: string): Promise<void> {
		const index = this.agencies.findIndex((a) => a.id === parseInt(id));
		if (index === -1) throw new Error("Agency not found");
		this.agencies.splice(index, 1);
	}

	async findByName(name: string): Promise<Agency[]> {
		return this.agencies.filter((a) => a.name === name);
	}

	async findByAddress(address: string): Promise<Agency[]> {
		return this.agencies.filter((a) => a.address === address);
	}

	async findByFoundation(foundation: Date): Promise<Agency[]> {
		return this.agencies.filter(
			(a) => a.foundation.getTime() === foundation.getTime()
		);
	}

	async findAll(): Promise<Agency[]> {
		return [...this.agencies];
	}
}

// Mock UnitOfWork
class MockUnitOfWork implements IUnitOfWork {
	private transactionActive = false;

	async beginTransaction(): Promise<void> {
		if (this.transactionActive) {
			throw new Error("Transaction already started");
		}
		this.transactionActive = true;
	}

	async commit(): Promise<void> {
		if (!this.transactionActive) {
			throw new Error("No active transaction");
		}
		this.transactionActive = false;
	}

	async rollback(): Promise<void> {
		if (!this.transactionActive) {
			throw new Error("No active transaction");
		}
		this.transactionActive = false;
	}

	isTransactionActive(): boolean {
		return this.transactionActive;
	}

	getTransaction(): any {
		return null;
	}
}

describe("Agency Use Cases", () => {
	let repository: IAgencyRepository;
	let unitOfWork: IUnitOfWork;
	let createUseCase: CreateAgencyUseCase;
	let getUseCase: GetAgencyUseCase;
	let listUseCase: ListAgenciesUseCase;
	let updateUseCase: UpdateAgencyUseCase;
	let deleteUseCase: DeleteAgencyUseCase;

	beforeEach(() => {
		repository = new MockAgencyRepository();
		unitOfWork = new MockUnitOfWork();
		createUseCase = new CreateAgencyUseCase(repository, unitOfWork);
		getUseCase = new GetAgencyUseCase(repository);
		listUseCase = new ListAgenciesUseCase(repository);
		updateUseCase = new UpdateAgencyUseCase(repository, unitOfWork);
		deleteUseCase = new DeleteAgencyUseCase(repository, unitOfWork);
	});

	describe("CreateAgencyUseCase", () => {
		it("should create an agency successfully", async () => {
			const agencyData = new CreateAgencyDTO(
				"SM Entertainment",
				"Seoul, South Korea",
				new Date("1995-02-14")
			);

			const result = await createUseCase.execute(agencyData);

			expect(result).toBeInstanceOf(AgencyResponseDTO);
			expect(result.name).toBe(agencyData.name);
			expect(result.address).toBe(agencyData.address);
			expect(result.foundation).toEqual(agencyData.foundation);
		});

		it("should not create an agency with duplicate name", async () => {
			const agencyData = new CreateAgencyDTO(
				"SM Entertainment",
				"Seoul, South Korea",
				new Date("1995-02-14")
			);

			await createUseCase.execute(agencyData);

			await expect(createUseCase.execute(agencyData)).rejects.toThrow(
				"Agency with this name already exists"
			);
		});
	});

	describe("GetAgencyUseCase", () => {
		it("should get an agency by id", async () => {
			// First create an agency
			const agencyData = new CreateAgencyDTO(
				"SM Entertainment",
				"Seoul, South Korea",
				new Date("1995-02-14")
			);
			const created = await createUseCase.execute(agencyData);

			// Then try to get it
			const result = await getUseCase.execute("1");

			expect(result).toBeInstanceOf(AgencyResponseDTO);
			expect(result.id).toBe(created.id);
			expect(result.name).toBe(created.name);
		});

		it("should throw error when agency not found", async () => {
			await expect(getUseCase.execute("999")).rejects.toThrow(
				"Agency not found"
			);
		});
	});

	describe("ListAgenciesUseCase", () => {
		it("should list all agencies", async () => {
			// Create some test agencies
			const agencies = [
				new CreateAgencyDTO(
					"SM Entertainment",
					"Seoul",
					new Date("1995-02-14")
				),
				new CreateAgencyDTO(
					"YG Entertainment",
					"Seoul",
					new Date("1996-02-24")
				),
				new CreateAgencyDTO(
					"JYP Entertainment",
					"Seoul",
					new Date("1997-02-25")
				),
			];

			for (const agency of agencies) {
				await createUseCase.execute(agency);
			}

			const result = await listUseCase.execute();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(agencies.length);
			expect(result[0]).toBeInstanceOf(AgencyResponseDTO);
		});
	});

	describe("UpdateAgencyUseCase", () => {
		it("should update an agency", async () => {
			// First create an agency
			const agencyData = new CreateAgencyDTO(
				"SM Entertainment",
				"Seoul, South Korea",
				new Date("1995-02-14")
			);
			const created = await createUseCase.execute(agencyData);

			// Update it
			const updateData = {
				name: "SM Entertainment Updated",
				address: "New Seoul Address",
			};

			const result = await updateUseCase.execute("1", updateData);

			expect(result).toBeInstanceOf(Agency);
			expect(result.name).toBe(updateData.name);
			expect(result.address).toBe(updateData.address);
		});

		it("should throw error when updating non-existent agency", async () => {
			await expect(
				updateUseCase.execute("999", { name: "Test" })
			).rejects.toThrow();
		});
	});

	describe("DeleteAgencyUseCase", () => {
		it("should delete an agency", async () => {
			// First create an agency
			const agencyData = new CreateAgencyDTO(
				"SM Entertainment",
				"Seoul, South Korea",
				new Date("1995-02-14")
			);
			await createUseCase.execute(agencyData);

			// Delete it
			await deleteUseCase.execute("1");

			// Try to get it - should throw error
			await expect(getUseCase.execute("1")).rejects.toThrow("Agency not found");
		});

		it("should throw error when deleting non-existent agency", async () => {
			await expect(deleteUseCase.execute("999")).rejects.toThrow();
		});
	});
});
