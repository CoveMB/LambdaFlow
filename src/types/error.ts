/* eslint-disable unicorn/custom-error-definition */
/* eslint-disable fp/no-class */

export abstract class FlowError extends Error {
  abstract message: string;

  abstract name: string;

  abstract status: number;

  abstract expose: boolean;
}
