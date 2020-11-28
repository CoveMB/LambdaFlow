/* eslint-disable @typescript-eslint/indent */
import { APIGatewayProxyHandlerV2, APIGatewayProxyHandler } from "aws-lambda";
import { LambdaFlowCallback } from "../../src/types";
import { lambdaContext, lambdaEvent } from "./data";

export const lambdaExecutor = async (
  lambdaFlowCallback: LambdaFlowCallback<
    APIGatewayProxyHandlerV2 | APIGatewayProxyHandler
  >
) => lambdaFlowCallback(lambdaEvent, lambdaContext, () => {});
