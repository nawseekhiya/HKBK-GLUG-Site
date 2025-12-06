import mongoose from "mongoose";
import { Event, EventRegistration, GuestRegistration } from "../models/index.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors.js";

export const createUserRegistration = async (eventId, userId, meta = {}) => {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      // Use findOneAndUpdate to acquire a write lock on the Event document
      // This forces serialization of concurrent registrations
      const event = await Event.findOneAndUpdate(
        { _id: eventId },
        { $set: { _lock: new Date() } }, // Dummy update to acquire write lock
        { session, new: true }
      );
      if (!event) {
        throw new NotFoundError("Event not found");
      }

      // Check capacity if set
      if (event.capacity > 0) {
        const userCount = await EventRegistration.countDocuments({ 
          event: eventId, 
          checkInStatus: { $ne: "cancelled" } 
        }).session(session);
        
        const guestCount = await GuestRegistration.countDocuments({ 
          event: eventId, 
          checkInStatus: { $ne: "cancelled" } 
        }).session(session);

        if (userCount + guestCount >= event.capacity) {
          throw new BadRequestError("Event is full");
        }
      }

      // Check for existing registration
      const existingReg = await EventRegistration.findOne({ event: eventId, user: userId }).session(session);
      if (existingReg) {
        if (existingReg.checkInStatus === "cancelled") {
          existingReg.checkInStatus = "pending";
          existingReg.registeredAt = new Date();
          existingReg.meta = meta;
          await existingReg.save({ session });
          result = existingReg;
          return;
        }
        throw new ConflictError("User already registered for this event");
      }

      const registration = new EventRegistration({
        event: eventId,
        user: userId,
        meta,
      });

      await registration.save({ session });
      result = registration;
    });
    return result;
  } finally {
    session.endSession();
  }
};

export const createGuestRegistration = async (eventId, guestData) => {
  const { name, email, phone, usn, meta } = guestData;
  
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      // Use findOneAndUpdate to acquire a write lock on the Event document
      // This forces serialization of concurrent registrations
      const event = await Event.findOneAndUpdate(
        { _id: eventId },
        { $set: { _lock: new Date() } }, // Dummy update to acquire write lock
        { session, new: true }
      );
      if (!event) {
        throw new NotFoundError("Event not found");
      }

      // Check capacity
      if (event.capacity > 0) {
        const userCount = await EventRegistration.countDocuments({ 
          event: eventId, 
          checkInStatus: { $ne: "cancelled" } 
        }).session(session);
        
        const guestCount = await GuestRegistration.countDocuments({ 
          event: eventId, 
          checkInStatus: { $ne: "cancelled" } 
        }).session(session);

        if (userCount + guestCount >= event.capacity) {
          throw new BadRequestError("Event is full");
        }
      }

      // Check for existing guest registration
      const existingReg = await GuestRegistration.findOne({ event: eventId, email }).session(session);
      if (existingReg) {
        if (existingReg.checkInStatus === "cancelled") {
          existingReg.checkInStatus = "pending";
          existingReg.registeredAt = new Date();
          existingReg.name = name;
          existingReg.phone = phone;
          existingReg.usn = usn;
          existingReg.meta = meta;
          await existingReg.save({ session });
          result = existingReg;
          return;
        }
        throw new ConflictError("Email already registered for this event");
      }

      const registration = new GuestRegistration({
        event: eventId,
        name,
        email,
        phone,
        usn,
        meta,
      });

      await registration.save({ session });
      result = registration;
    });
    return result;
  } finally {
    session.endSession();
  }
};
