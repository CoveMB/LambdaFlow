import { ErrorBuilder } from "../types/error";

const errorBuilder: ErrorBuilder = (expose = false) => (statusCode = 500) => (
  error = new Error()
) => ({
  expose,
  statusCode,
  error,
  message: error.message,
});

const simpleError = errorBuilder()();

const exposedError = errorBuilder(true);
const nonExposedError = errorBuilder(false);

const notFoundError = errorBuilder(true)(404);
const notAuthorizedError = errorBuilder(true)(403);
const unprocessableError = errorBuilder(true)(422);

export {
  errorBuilder,
  exposedError,
  nonExposedError,
  simpleError,
  notFoundError,
  notAuthorizedError,
  unprocessableError,
};
