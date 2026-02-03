import { RegisterUserDto } from "../dto/user_dto";
import { UserRepositories } from "../repositories/user_repositories";
import * as bcrypt from "bcrypt";

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

  async login() {
    // implementation
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
