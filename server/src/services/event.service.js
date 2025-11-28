import { Event } from "../models/index.js";

export const listEvents = async (query) => {
  const { page = 1, limit = 20, sort = "date:asc", ...filters } = query;
  const skip = (page - 1) * limit;

  const dbQuery = { deletedAt: null };

  if (filters.upcoming === "true") {
    dbQuery.date = { $gte: new Date() };
  }
  
  if (filters.tag) {
    dbQuery.tags = filters.tag;
  }

  // Handle sorting
  const [sortField, sortOrder] = sort.split(":");
  const sortOptions = { [sortField]: sortOrder === "desc" ? -1 : 1 };

  const [data, total] = await Promise.all([
    Event.find(dbQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit)),
    Event.countDocuments(dbQuery),
  ]);

  return {
    data,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEventById = async (id) => {
  const event = await Event.findOne({ _id: id, deletedAt: null });
  return event;
};

export const createEvent = async (data) => {
  const event = await Event.create(data);
  return event;
};

export const updateEvent = async (id, data) => {
  const event = await Event.findOneAndUpdate(
    { _id: id, deletedAt: null },
    data,
    { new: true, runValidators: true }
  );
  return event;
};

export const deleteEvent = async (id) => {
  const event = await Event.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );
  return event;
};
