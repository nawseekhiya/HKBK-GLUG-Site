import * as eventService from "../services/event.service.js";
import { logger } from "../config/logger.js";

export const list = async (req, res, next) => {
  try {
    const result = await eventService.listEvents(req.query);
    // listEvents returns { data, meta }
    res.status(200).json({
      status: "success",
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ status: "success", data: event });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body);
    logger.info({ eventId: event._id }, "Event created");
    res.status(201).json({ status: "success", data: event });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    logger.info({ eventId: event._id }, "Event updated");
    res.status(200).json({ status: "success", data: event });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const event = await eventService.deleteEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    logger.info({ eventId: event._id }, "Event deleted (soft)");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
