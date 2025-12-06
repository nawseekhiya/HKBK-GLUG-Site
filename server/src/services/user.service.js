import { User, UserContribution, EventRegistration } from "../models/index.js";
import { NotFoundError } from "../utils/errors.js";

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("name avatar bio githubUsername role joinedAt");
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const contributions = await UserContribution.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20); // Limit for now, pagination later if needed

  const registrations = await EventRegistration.find({ user: userId })
    .populate("event", "title date location type")
    .sort({ createdAt: -1 })
    .limit(20);

  const events = registrations.map(reg => reg.event).filter(e => e); // Filter out nulls if event deleted

  return {
    user,
    contributions,
    events,
  };
};

export const addUserContribution = async (userId, data) => {
  const contribution = new UserContribution({
    user: userId,
    ...data,
  });
  await contribution.save();
  return contribution;
};
