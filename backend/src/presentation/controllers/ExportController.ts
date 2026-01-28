import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/di/Types";
import type { ExportArtistsToPdfUseCase } from "../../application/usesCase/exports/ExportArtistsToPdfUseCase";
import type { Request, Response } from "express";
import type { ExportCalendarToPdfUseCase } from "../../application/usesCase/exports/ExportCalendarToPdfUseCase";
import type { ExportArtistsOnDebutPdfUseCase } from "../../application/usesCase/exports/ExportArtistsOnDebutPdfUseCase";
import type { ExportAgenciesPdfUseCase } from "../../application/usesCase/exports/ExportAgenciesPdfUseCase";
import type { ExportApprenticesPdfUseCase } from "../../application/usesCase/exports/ExportApprenticesPdfUseCase";
import type { ExportGroupsPdfUseCase } from "../../application/usesCase/exports/ExportGroupsPdfUseCase";
import type { ExportConceptsPdfUseCase } from "../../application/usesCase/exports/ExportConceptsPdfUseCase";
import type { ExportAwardsPdfUseCase } from "../../application/usesCase/exports/ExportAwardsPdfUseCase";
import type { ExportSongsPdfUseCase } from "../../application/usesCase/exports/ExportSongsPdfUseCase";
import type { ExportAlbumsPdfUseCase } from "../../application/usesCase/exports/ExportAlbumsPdfUseCase";
import type { ExportActivitiesPdfUseCase } from "../../application/usesCase/exports/ExportActivitiesPdfUseCase";
import type { ExportContractsPdfUseCase } from "../../application/usesCase/exports/ExportContractsPdfUseCase";
import type { ExportIncomesPdfUseCase } from "../../application/usesCase/exports/ExportIncomesPdfUseCase";
import type { ExportApplicationsPdfUseCase } from "../../application/usesCase/exports/ExportApplicationsUseCase";
import type { ExportUsersPdfUseCase } from "../../application/usesCase/exports/ExportUsersPdfUseCase";
import type { ExportArtistOnChangePdfUseCase } from "../../application/usesCase/exports/ExportArtistOnChangePdfUseCase";
import type { ExportTotalIncomePdfUseCase } from "../../application/usesCase/exports/ExportTotalIncomePdfUseCase";
import type { ExportSoloArtistPdfUseCase } from "../../application/usesCase/exports/ExportSoloArtistPdfUseCase";
import { RequestArtistWithIncomeDto } from "../../application/dtos/artist/RequestArtistWithIncomeDto";

 

@injectable()
export class ExportController {
    constructor(
        @inject(Types.ExportArtistsToPdfUseCase) private exportArtistsToPdf: ExportArtistsToPdfUseCase,
        @inject(Types.ExportCalendarToPdfUseCase) private exportCalendarToPdf: ExportCalendarToPdfUseCase,
        @inject(Types.ExportArtistsOnDebutPdfUseCase)private exportArtistsOnDebut:ExportArtistsOnDebutPdfUseCase,
        @inject(Types.ExportAgenciesPdfUseCase)private exportAgencies:ExportAgenciesPdfUseCase,
        @inject(Types.ExportApprenticesPdfUseCase)private exportApprentices:ExportApprenticesPdfUseCase,
        @inject(Types.ExportGroupsPdfUseCase)private exportGroups:ExportGroupsPdfUseCase,
        @inject(Types.ExportConceptsPdfUseCase) private exportConcepts:ExportConceptsPdfUseCase,
        @inject(Types.ExportAwardsPdfUseCase)private exportAwards:ExportAwardsPdfUseCase,
        @inject(Types.ExportSongsPdfUseCase)private exportSongs:ExportSongsPdfUseCase,
        @inject(Types.ExportAlbumsPdfUseCase)private exportAlbums:ExportAlbumsPdfUseCase,
        @inject(Types.ExportActivitiesPdfUseCase)private exportActivities:ExportActivitiesPdfUseCase,
        @inject(Types.ExportContractsPdfUseCase)private exportContracts:ExportContractsPdfUseCase,
        @inject(Types.ExportIncomesPdfUseCase)private exportIncomes:ExportIncomesPdfUseCase,
        @inject(Types.ExportApplicationsPdfUseCase)private exportApplications:ExportApplicationsPdfUseCase,
        @inject(Types.ExportUsersPdfUseCase) private exportUsers:ExportUsersPdfUseCase,
        @inject(Types.ExportArtistOnChangePdfUseCase) private exportArtistOnChange:ExportArtistOnChangePdfUseCase,
        @inject(Types.ExportTotalIncomePdfUseCase) private exportTotalIncome:ExportTotalIncomePdfUseCase,
        @inject(Types.ExportSoloArtistPdfUseCase) private exportSoloArtist:ExportSoloArtistPdfUseCase,
    ) {}

    async exportArtistsPdf(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const pdfBuffer = await this.exportArtistsToPdf.execute(
                id ? Number(id) : undefined
            );

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportCalendarPdf(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const pdfBuffer = await this.exportCalendarToPdf.execute(id!);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=calendar_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportArtistsOnDebutPdf(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const pdfBuffer = await this.exportArtistsOnDebut.execute(Number(id));

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=artistas_debut_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportAgenciesPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportAgencies.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=agency_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportApprenticesPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportApprentices.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=apprentice_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

     async exportGroupsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportGroups.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=group_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportConceptsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportConcepts.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=concept_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportAwardsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportAwards.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=award_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }
    
    async exportSongsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportSongs.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=song_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportAlbumsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportAlbums.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=album_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportActivitiesPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportActivities.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=activity_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportContractsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportContracts.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=contract_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportIncomesPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportIncomes.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=income_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportApplicationsPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportApplications.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=application_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportUsersPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportUsers.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=users_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportArtistOnChangePdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportArtistOnChange.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=users_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportTotalIncomePdf(req: Request, res: Response): Promise<void> {
        try {
            
            const data=RequestArtistWithIncomeDto.create(req.body)
            const pdfBuffer = await this.exportTotalIncome.execute(data)

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=users_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }

    async exportSoloArtistPdf(req: Request, res: Response): Promise<void> {
        try {
            
            
            const pdfBuffer = await this.exportSoloArtist.execute()

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=users_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error generando PDF' });
        }
    }
}

