/* eslint-disable max-classes-per-file */
/* eslint-disable fp/no-class */
import { FlowError } from "types/error";

export class ExposedError extends FlowError {
  message!: string;

  name = "ExposedError";

  status = 405;

  expose = true;

  // This error is generated if a configuration fails
  constructor(message: string) {
    super(`The exposed message is: ${message}`);
  }
}

export class NonExposedError extends FlowError {
  message!: string;

  name = "NonExposedError";

  status = 567;

  expose = false;

  // This error is generated if a configuration fails
  constructor(message: string) {
    super(`The secret error message is: ${message}`);
  }
}
