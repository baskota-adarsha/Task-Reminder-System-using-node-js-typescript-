import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Create an account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: asha@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       201: { description: Account created }
 *       400: { description: Invalid input }
 *       409: { description: Email already used }
 */
router.post("/register", register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: asha@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200: { description: Returns a token }
 *       401: { description: Invalid credentials }
 */
router.post("/login", login);

export default router;
