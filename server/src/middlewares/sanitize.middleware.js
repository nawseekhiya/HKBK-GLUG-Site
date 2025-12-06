import mongoSanitize from "@exortek/express-mongo-sanitize";
import xss from "xss";

export const mongoSanitizeMiddleware = mongoSanitize();

const sanitizeValue = (v) => {
  if (typeof v === "string") return xss(v);
  if (Array.isArray(v)) return v.map(sanitizeValue);
  if (v && typeof v === "object") return sanitizeObject(v);
  return v;
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  Object.keys(obj).forEach(k => {
    try {
      obj[k] = sanitizeValue(obj[k]);
    } catch (e) {
      // ignore problematic entries
    }
  });
  return obj;
};

export const xssCleanMiddleware = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};
