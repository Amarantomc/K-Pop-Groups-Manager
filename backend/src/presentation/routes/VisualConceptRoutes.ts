// import { Router } from "express";
// import type { VisualConceptController } from "../controllers/VisualConceptController";
// import { container } from "../../infrastructure/di/Container";
// import { Types } from "../../infrastructure/di/Types";
// import multer from "multer"

// const upload = multer({dest: "uploads/"});

// export class VisualConceptRoutes{
//     private router: Router;
//     private VisualConceptController: VisualConceptController;
  

//   constructor() {
//     this.router = Router();
//     this.VisualConceptController =container.get<VisualConceptController>(Types.VisualConceptController)
//     this.setupRoutes();
//   }

//   private setupRoutes(): void {
     
//     this.router.post('/',upload.single('image') ,(req, res) => this.VisualConceptController.createVisualConcept(req, res))
//     this.router.get('/:id', (req, res) => this.VisualConceptController.getVisualConcept(req,res))
//     this.router.put('/:id', (req, res) => this.VisualConceptController.updateVisualConcept(req, res))
//     this.router.delete('/:id',(req, res) => this.VisualConceptController.deleteVisualConcept(req, res))
//     this.router.get('/',(req, res) => this.VisualConceptController.listVisualConcept(req, res))
//   }

//   public getRouter(): Router {
//     return this.router;
//   }
// }

import { Router } from "express";
import type { VisualConceptController } from "../controllers/VisualConceptController";
import { container } from "../../infrastructure/di/Container";
import { Types } from "../../infrastructure/di/Types";
import multer from "multer";
import path from "path";

// Configuración de multer para guardar en frontend/public/visual-concepts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../../../frontend/public/visual-concepts/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

export class VisualConceptRoutes {
  private router: Router;
  private VisualConceptController: VisualConceptController;

  constructor() {
    this.router = Router();
    this.VisualConceptController = container.get<VisualConceptController>(Types.VisualConceptController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', upload.single('image'), (req, res) => this.VisualConceptController.createVisualConcept(req, res));
    this.router.get('/:id', (req, res) => this.VisualConceptController.getVisualConcept(req, res));
    this.router.put('/:id', upload.single('image'), (req, res) => this.VisualConceptController.updateVisualConcept(req, res));
    this.router.delete('/:id', (req, res) => this.VisualConceptController.deleteVisualConcept(req, res));
    this.router.get('/', (req, res) => this.VisualConceptController.listVisualConcept(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}