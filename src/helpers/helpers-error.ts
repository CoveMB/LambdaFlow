import { ErrorBuilder } from "../types/error";
import * as R from "ramda";

const errorBuilder: ErrorBuilder = (expose = false) => (statusCode = 500) => (
  message = "Internal Server Error"
) => ({
  expose,
  statusCode,
  message: R.when(R.is(Object), R.prop("message"))(message),
  error: R.unless(R.is(Object), () => new Error(message as string))(message),
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
