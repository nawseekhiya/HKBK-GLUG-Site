import { verifyAccessToken } from "../services/auth.service.js";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { sub: userId, role: role }
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError("Not authenticated");
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }

    next();
  };
};
