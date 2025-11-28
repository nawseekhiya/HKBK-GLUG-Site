import { Router } from "express";
import eventsRouter from "./events.router.js";
import authRouter from "./auth.router.js";
import registrationsRouter from "./registrations.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/events", eventsRouter);
router.use("/", registrationsRouter);

export default router;
