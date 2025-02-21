import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";

export class CategoryController {
  constructor() {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  };

  createCategory = async (req: Request, res: Response) => {
    res.json('createCategory');
  }

  getCategories = async (req: Request, res: Response) => {
    res.json('getCategories');
  }

  updateCategory = async (req: Request, res: Response) => {
    res.json('updateCategory');
  }

  deleteCategory = async (req: Request, res: Response) => {
    res.json('deleteCategory');
  }
}
