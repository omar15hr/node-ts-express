import { Router } from "express";
import { CategoryController } from "./controller";

export class CategoryRoutes {

  static get routes(): Router {
    const router = Router();

    const controller = new CategoryController();

    // Definir las rutas
    router.get('/', controller.getCategories);
    router.post('/', controller.createCategory);
    router.put('/', controller.updateCategory);
    router.delete('/', controller.deleteCategory);

    return router;
  }
}
