import { Request, Response } from "express";
import { z } from "zod";
import { UserServices } from "../services/user_services";

const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(3),
  password: z.string().min(6),
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

  async login(req: Request, res: Response) {}

  async logout(req: Request, res: Response) {}

  async getProfile(req: Request, res: Response) {}

  async updateProfile(req: Request, res: Response) {}

  async deleteProfile(req: Request, res: Response) {}
}
