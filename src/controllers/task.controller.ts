import { Request, Response } from "express";
import { Task } from "../models";
import { currentUser } from "../utils/auth";
export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { title, remindAt } = req.body;
  if (!title) {
    res.status(400).json({ message: "Title is required" });
    return;
  }
  let remindDate: Date | null = null;
  if (remindAt) {
    remindDate = new Date(remindAt);
    if (isNaN(remindDate.getTime())) {
      res.status(400).json({ message: "remindAt is not a valid date" });
      return;
    }
  }
  const task = await Task.create({
    title,
    remindAt: remindDate,
    userId: currentUser(req).id,
  });
  res.status(201).json(task);
};

export const listTasks = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  const where: { userId: number; done?: boolean } = {
    userId: currentUser(req).id,
  };
  if (req.query.done === "true") where.done = true;
  if (req.query.done === "false") where.done = false;
  const { rows, count } = await Task.findAndCountAll({
    where,
    limit,
    offset: (page - 1) * limit,
    order: [["createdAt", "DESC"]],
  });

  res.json({
    data: rows,
    meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
  });
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  const task = await Task.findOne({
    where: { id: Number(req.params.id), userId: currentUser(req).id },
  });

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json({ task });
};

export const updateTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const task = await Task.findOne({
    where: { id: Number(req.params.id), userId: currentUser(req).id },
  });
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  const { title, remindAt, done } = req.body;
  if (title !== undefined) {
    if (!title) {
      res.status(400).json({ message: "Title cannot be empty" });
      return;
    }
    task.title = title;
  }

  if (remindAt !== undefined) {
    const date = remindAt ? new Date(remindAt) : null;
    if (date && isNaN(date.getTime())) {
      res.status(400).json({ message: "remindAt is not a valid date" });
      return;
    }
    task.remindAt = date;
    task.reminded = false;
  }

  if (done !== undefined) task.done = Boolean(done);
  await task.save();
  res.json(task);
};
export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const deleted = await Task.destroy({
    where: { id: Number(req.params.id), userId: currentUser(req).id },
  });

  if (!deleted) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(204).send();
};
