import * as registrationService from "../services/registration.service.js";

export const registerUser = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.sub; // From auth middleware
  const { meta } = req.body;

  const registration = await registrationService.createUserRegistration(
    eventId,
    userId,
    meta
  );

  res.status(201).json({
    status: "success",
    data: {
      registrationId: registration._id,
      status: registration.checkInStatus,
      registeredAt: registration.registeredAt,
    },
  });
};

export const registerGuest = async (req, res) => {
  const { eventId } = req.params;
  const guestData = req.body;

  const registration = await registrationService.createGuestRegistration(
    eventId,
    guestData
  );

  res.status(201).json({
    status: "success",
    data: {
      registrationId: registration._id,
      status: registration.checkInStatus,
      registeredAt: registration.registeredAt,
    },
  });
};
