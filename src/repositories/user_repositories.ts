import { User } from "../../prisma/generated/prisma/client";
import { prismaApp } from "../config/prisma";
import { RegisterUserDto } from "../dto/user_dto";

interface IUserRepositories {
  createUser(data: RegisterUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}

export class UserRepositories implements IUserRepositories {
  async findByEmail(email: string) {
    const data = await prismaApp.user.findUnique({
      where: { email },
    });
    return data;
  }

  async findByUsername(username: string) {
    const data = await prismaApp.user.findUnique({
      where: { username },
    });
    return data;
  }

  async createUser(data: RegisterUserDto) {
    const user = await prismaApp.user.create({
      data,
    });
    return user;
  }
}
