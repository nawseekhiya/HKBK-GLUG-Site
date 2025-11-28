import { Router } from "express";
import * as eventController from "../controllers/events.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { z } from "zod";

const router = Router();

// Validation Schemas
const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().datetime({ message: "Invalid ISO date" }), // Expect ISO string
  venue: z.string().optional(),
  capacity: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  banner: z.string().url().optional().or(z.literal("")),
});

const updateEventSchema = createEventSchema.partial();

const listQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  sort: z.string().optional(),
  upcoming: z.enum(["true", "false"]).optional(),
  tag: z.string().optional(),
});

// Routes
router.get("/", validate({ query: listQuerySchema }), eventController.list);
router.get("/:id", eventController.get);
router.post("/", validate({ body: createEventSchema }), eventController.create);
router.put("/:id", validate({ body: updateEventSchema }), eventController.update);
router.delete("/:id", eventController.remove);

export default router;
