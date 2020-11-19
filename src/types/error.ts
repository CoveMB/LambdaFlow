export type FlowError = {
  expose: boolean;
  code: number;
  error: Error;
};

export type ErrorBuilder = (
  expose?: boolean
) => (code?: number) => (error: Error) => FlowError;
