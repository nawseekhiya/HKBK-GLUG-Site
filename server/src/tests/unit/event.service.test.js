import { describe, it, expect } from "@jest/globals";
import * as eventService from "../../services/event.service.js";
import { Event } from "../../models/index.js";

describe("Event Service Unit Tests", () => {
  it("should create a new event", async () => {
    const eventData = {
      title: "Unit Test Event",
      description: "Description",
      date: new Date(),
      location: "Location",
      capacity: 50,
    };

    const event = await eventService.createEvent(eventData);
    expect(event).toBeDefined();
    expect(event.title).toBe(eventData.title);
  });

  it("should list events", async () => {
    await Event.create({
      title: "List Event 1",
      description: "Desc",
      date: new Date(),
      location: "Loc",
      capacity: 10,
    });

    await Event.create({
      title: "List Event 2",
      description: "Desc",
      date: new Date(),
      location: "Loc",
      capacity: 10,
    });

    const events = await eventService.listEvents();
    expect(events.data.length).toBeGreaterThanOrEqual(2);
  });
});
