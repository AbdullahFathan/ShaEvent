import { Request, Response } from "express";
import { z } from "zod";
import { UserServices } from "../services/user_services";
import { AuthRequest } from "../middlewares/auth_middleware";
import { sendError, sendSuccess } from "../utils/response";

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class UserController {
  userServices = new UserServices();

  async register(req: Request, res: Response) {
    try {
      const validated = registerSchema.parse(req.body);

      const result = await this.userServices.register(validated);
      return sendSuccess(res, result, "Registration successful", 201);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return sendError(res, "Validation Error", 400, error.flatten());
      }
      if (
        error.message === "Email already registered" ||
        error.message === "User already exists"
      ) {
        return sendError(res, error.message, 409);
      }

      return sendError(res, "Internal Server Error", 500, error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validated = loginSchema.parse(req.body);

      const result = await this.userServices.login(validated);
      return sendSuccess(res, result, "Login successful");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return sendError(res, "Validation Error", 400, error.flatten());
      }
      if (
        error.message === "User not found" ||
        error.message === "Invalid password"
      ) {
        return sendError(res, error.message, 401);
      }

      return sendError(res, "Internal Server Error", 500, error);
    }
  }

  async me(req: AuthRequest, res: Response) {
    const user = req.user;

    if (!user) {
      return sendError(res, "User data not found", 401);
    }

    return sendSuccess(res, user, "User profile retrieved successfully");
  }

  async logout(req: Request, res: Response) {
    // Implementation for logout if needed
    return sendSuccess(res, null, "Logout successful");
  }

  async getProfile(req: Request, res: Response) {}

  async updateProfile(req: Request, res: Response) {}

  async deleteProfile(req: Request, res: Response) {}
}
