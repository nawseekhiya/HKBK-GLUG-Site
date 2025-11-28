import { z } from "zod";

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
      return res.status(400).json({
        error: "Validation Error",
        details: (error.issues || []).map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};
