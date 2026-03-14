import { UserServices } from "../services/user_services";
import { UserRepositories } from "../repositories/user_repositories";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock all external dependencies
jest.mock("../config/prisma", () => ({ prismaApp: {} }));
jest.mock("../repositories/user_repositories");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../config/config_app", () => ({
  configApp: {
    jwt: {
      secret: "test-secret",
      expiresIn: "1h",
    },
  },
}));

const MockedUserRepositories = UserRepositories as jest.MockedClass<
  typeof UserRepositories
>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

const mockUser = {
  id: 1,
  email: "test@example.com",
  username: "testuser",
  password: "hashed_password",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("UserServices", () => {
  let userServices: UserServices;
  let mockUserRepo: jest.Mocked<UserRepositories>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Instantiate and grab the mocked instance
    userServices = new UserServices();
    mockUserRepo = MockedUserRepositories.mock
      .instances[0] as jest.Mocked<UserRepositories>;
  });

  // ─── register ─────────────────────────────────────────────────────────────

  describe("register", () => {
    const registerData = {
      email: "test@example.com",
      username: "testuser",
      password: "plainpassword",
    };

    it("should register a new user and return user without password", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.findByUsername.mockResolvedValue(null);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      mockUserRepo.createUser.mockResolvedValue(mockUser);

      const result = await userServices.register(registerData);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(mockUserRepo.findByUsername).toHaveBeenCalledWith(
        registerData.username,
      );
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
      expect(mockUserRepo.createUser).toHaveBeenCalledWith({
        ...registerData,
        password: "hashed_password",
      });
      expect(result).not.toHaveProperty("password");
      expect(result).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });
    });

    it("should throw 'User already exists' when email is taken", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(userServices.register(registerData)).rejects.toThrow(
        "User already exists",
      );
      expect(mockUserRepo.findByUsername).not.toHaveBeenCalled();
      expect(mockUserRepo.createUser).not.toHaveBeenCalled();
    });

    it("should throw 'Username already exists' when username is taken", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.findByUsername.mockResolvedValue(mockUser);

      await expect(userServices.register(registerData)).rejects.toThrow(
        "Username already exists",
      );
      expect(mockUserRepo.createUser).not.toHaveBeenCalled();
    });
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe("login", () => {
    const loginData = {
      email: "test@example.com",
      password: "plainpassword",
    };

    it("should login and return user data with a JWT token", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockedJwt.sign as jest.Mock).mockReturnValue("signed.jwt.token");

      const result = await userServices.login(loginData);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password,
      );
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: "USER" },
        "test-secret",
        { expiresIn: "1h" },
      );
      expect(result).not.toHaveProperty("password");
      expect(result.token).toBe("signed.jwt.token");
    });

    it("should throw 'User not found' when email does not exist", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(userServices.login(loginData)).rejects.toThrow(
        "User not found",
      );
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it("should throw 'Invalid password' when password is wrong", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userServices.login(loginData)).rejects.toThrow(
        "Invalid password",
      );
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });
  });
});
