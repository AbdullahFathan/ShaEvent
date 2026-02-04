import { JwtPayload } from "jsonwebtoken";

// Kita "suntik" properti user ke dalam Express Request secara global
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}
