import { z } from "zod";
import { ValidationError } from "../utils/errors.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const { body, query, params } = req;
    
    // Validate request parts against schema if defined
    if (schema.body) {
      const validatedBody = schema.body.parse(body);
      Object.defineProperty(req, 'body', { value: validatedBody, writable: true });
    }
    if (schema.query) {
      const validatedQuery = schema.query.parse(query);
      Object.defineProperty(req, 'query', { value: validatedQuery, writable: true });
    }
    if (schema.params) {
      const validatedParams = schema.params.parse(params);
      Object.defineProperty(req, 'params', { value: validatedParams, writable: true });
    }

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = (error.issues || []).map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      return next(new ValidationError("Validation Failed", details));
    }
    next(error);
  }
};

export const eventIdSchema = {
  params: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Event ID"),
  }),
};

export const registerGuestSchema = {
  body: z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    phone: z.string().optional(),
    usn: z.string().optional(),
    meta: z.record(z.string()).optional(),
  }),
};

export const registerUserSchema = {
  body: z.object({
    meta: z.record(z.string()).optional(),
  }),
};
