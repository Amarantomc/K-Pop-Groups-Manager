import { Application } from '../../../domain';
import { ApplicationResponseDto } from '../../dtos/application(solicitud)/ApplicationResponseDto';
import type { IApplicationRepository } from '../../interfaces/repositories/IApplicationRepository';

export class FindByAgencyUseCase {
    private applicationRepository: IApplicationRepository;

    constructor(applicationRepository: IApplicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    async execute(agencyId:number,applicationId: number): Promise<Application[]> {
        if (!applicationId) {
            throw new Error('Application ID must be provided');
        }

        const applications = await this.applicationRepository.findByAgency(agencyId,applicationId);
        if (!applications) {
            throw new Error('Applications not found');
        }

        return ApplicationResponseDto.toEntities(applications);

    }
}