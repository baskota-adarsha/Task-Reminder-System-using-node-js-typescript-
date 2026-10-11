import { Request } from "express";
import { User } from "../models";

export const currentUser = (req: Request) => req.user as User;
