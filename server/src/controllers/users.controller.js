import * as userService from "../services/user.service.js";
import { ForbiddenError } from "../utils/errors.js";

export const getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await userService.getUserProfile(id);
    res.json({ status: "success", data: profile });
  } catch (error) {
    next(error);
  }
};

export const addContribution = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Ownership check
    // req.user.sub is the ID from the JWT
    if (req.user.sub !== id && req.user.role !== "admin") {
      throw new ForbiddenError("You are not authorized to perform this action");
    }

    const contribution = await userService.addUserContribution(id, req.body);
    res.status(201).json({ status: "success", data: contribution });
  } catch (error) {
    next(error);
  }
};
