import { Request, Response } from "express";
import { z } from "zod";
import { UserServices } from "../services/user_services";
import { AuthRequest } from "../middlewares/auth_middleware";

const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export class UserController {
  userServices = new UserServices();

  async register(req: Request, res: Response) {
    try {
      const validated = registerSchema.parse(req.body);

      const result = await this.userServices.register(validated);
      return res.status(201).json({ data: result });
    } catch (error: any) {
      console.log(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.message });
      }
      if (
        error.message === "Email already registered" ||
        error.message === "User already exists"
      ) {
        return res.status(409).json({ success: false, message: error.message });
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validated = loginSchema.parse(req.body);

      const result = await this.userServices.login(validated);
      return res.status(200).json({ data: result });
    } catch (error: any) {
      console.log(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.message });
      }
      if (
        error.message === "User not found" ||
        error.message === "Invalid password"
      ) {
        return res.status(401).json({ success: false, message: error.message });
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  async me(req: AuthRequest, res: Response) {
    // Sekarang TypeScript tahu bahwa 'req.user' itu ada!
    const user = req.user;

    // Safety check (jaga-jaga kalau middleware bolong)
    if (!user) {
      return res.status(401).json({ message: "User data not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  async logout(req: Request, res: Response) {}

  async getProfile(req: Request, res: Response) {}

  async updateProfile(req: Request, res: Response) {}

  async deleteProfile(req: Request, res: Response) {}
}
