import { ErrorBuilder } from "../types/error";

const errorBuilder: ErrorBuilder = (expose = false) => (code = 500) => (
  error = new Error()
) => ({
  expose,
  code,
  error,
});

const simpleError = errorBuilder()();

const exposedError = errorBuilder(true);
const nonExposedError = errorBuilder(false);

const notFoundError = errorBuilder(true)(404);

export {
  errorBuilder,
  exposedError,
  nonExposedError,
  simpleError,
  notFoundError,
};
