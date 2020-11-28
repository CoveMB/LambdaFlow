import { FlowBox, FlowBoxWithError } from "./box";

export type FlowError = {
  expose: boolean;
  code: number;
  error: Error;
};

export type ErrorBuilder = (
  expose?: boolean
) => (code?: number) => (error?: Error) => FlowError;

export type ErrorCallback = (box: FlowBoxWithError) => void;

export type ErrorCallbackHandler = (
  errorCallback: ErrorCallback
) => (box: Promise<FlowBox>) => Promise<FlowBox>;
