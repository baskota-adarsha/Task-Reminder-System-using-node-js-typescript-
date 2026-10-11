import { Request, Response, NextFunction } from "express";
export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
};
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(error);
  res.status(500).json({ message: "Something went wrong" });
};
