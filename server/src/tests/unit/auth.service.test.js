import { describe, it, expect, beforeAll } from "@jest/globals";
import * as authService from "../../services/auth.service.js";
import { User } from "../../models/index.js";
import { BadRequestError, UnauthorizedError, ConflictError } from "../../utils/errors.js";

describe("Auth Service Unit Tests", () => {
  it("should register a new user", async () => {
    const userData = {
      name: "Unit Test User",
      email: "unit_auth@example.com",
      password: "password123",
    };

    const { user, accessToken, refreshToken } = await authService.register(userData);

    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.passwordHash).not.toBe(userData.password);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("should throw error if email already exists", async () => {
    const userData = {
      name: "Duplicate User",
      email: "duplicate@example.com",
      password: "password123",
    };

    await authService.register(userData);

    // FIX: Expect ConflictError instead of BadRequestError
    await expect(authService.register(userData)).rejects.toThrow(ConflictError);
  });

  it("should login with correct credentials", async () => {
    const userData = {
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    };

    await authService.register(userData);

    const { user, accessToken } = await authService.login(userData.email, userData.password);
    expect(user.email).toBe(userData.email);
    expect(accessToken).toBeDefined();
  });

  it("should throw error with incorrect password", async () => {
    const userData = {
      name: "Wrong Pass User",
      email: "wrongpass@example.com",
      password: "password123",
    };

    await authService.register(userData);

    await expect(authService.login(userData.email, "wrong")).rejects.toThrow(UnauthorizedError);
  });
});
