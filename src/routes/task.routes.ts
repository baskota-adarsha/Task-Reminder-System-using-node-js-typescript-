import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
  createTask,
  updateTask,
  listTasks,
  getTask,
  deleteTask,
} from "../controllers/task.controller";

const router = Router();
router.use(auth);
/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List my tasks (paginated)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10, maximum: 50 } }
 *       - { in: query, name: done, schema: { type: boolean }, description: Filter by done }
 *     responses:
 *       200:
 *         description: A page of tasks plus meta (total, page, limit, totalPages)
 *       401: { description: Missing or invalid token }
 */

router.get("/", listTasks);

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: Submit report }
 *               remindAt: { type: string, format: date-time, example: "2026-10-05T18:00:00+05:45" }
 *     responses:
 *       201: { description: Task created }
 *       400: { description: Invalid input }
 *       401: { description: Missing or invalid token }
 */
router.post("/", createTask);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get one of my tasks
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: The task }
 *       404: { description: Not found }
 *       401: { description: Missing or invalid token }
 
 */

router.get("/:id", getTask);
/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task (title, remindAt, done)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               remindAt: { type: string, format: date-time, nullable: true }
 *               done: { type: boolean }
 *     responses:
 *       200: { description: Updated task }
 *       404: { description: Not found }
 *       401: { description: Missing or invalid token }
 
 */
router.patch("/:id", updateTask);
/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Not found }
 *       401: { description: Missing or invalid token }
 
 */

router.delete("/:id", deleteTask);
export default router;
