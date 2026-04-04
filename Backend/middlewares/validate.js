import { validationResult } from "express-validator";

/**
 * Centralized validation error handler.
 * Use after any express-validator chain in a route.
 * Returns 422 with a clean errors array if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export default validate;
