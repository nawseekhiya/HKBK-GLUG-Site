import { Router } from "express";
import eventsRouter from "./events.router.js";

const router = Router();

router.use("/events", eventsRouter);

export default router;
