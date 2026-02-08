import { configApp } from "../config/config_app";
import { LoginUserDto, RegisterUserDto } from "../dto/user_dto";
import { UserRepositories } from "../repositories/user_repositories";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserServices {
  userRepo = new UserRepositories();

  async register(data: RegisterUserDto) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await this.userRepo.findByUsername(data.username);
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = await this.userRepo.createUser({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(data: LoginUserDto) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    console.log("Signing token with secret:", configApp.jwt.secret);
    console.log("Token expires in:", configApp.jwt.expiresIn);

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        role: "USER",
      },
      configApp.jwt.secret as string,
      { expiresIn: configApp.jwt.expiresIn as any },
    );

    const { password, ...userWithoutPassword } = existingUser;
    return { ...userWithoutPassword, token };
  }

  async logout() {
    // implementation
  }

  async getProfile() {
    // implementation
  }

  async updateProfile() {
    // implementation
  }

  async deleteProfile() {
    // implementation
  }
}
