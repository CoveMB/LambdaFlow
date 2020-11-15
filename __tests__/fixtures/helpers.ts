import { LambdaFlowCallback } from "../../src/types";
import { lambdaContext, lambdaEvent } from "./data";

export const lambdaExecutor = (lambdaFlowCallback: LambdaFlowCallback) =>
  lambdaFlowCallback(lambdaEvent, lambdaContext, () => {});
