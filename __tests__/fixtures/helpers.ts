import { APIGatewayProxyHandlerV2, APIGatewayProxyHandler } from "aws-lambda";
import { LambdaFlowCallback } from "../../src/types";
import { lambdaContext, lambdaEvent, lambdaEventV1 } from "./data";

export const lambdaExecutor = async (
  lambdaFlowCallback: LambdaFlowCallback<APIGatewayProxyHandlerV2>
) => lambdaFlowCallback(lambdaEvent, lambdaContext, () => {});

export const lambdaExecutorV1 = async (
  lambdaFlowCallback: LambdaFlowCallback<APIGatewayProxyHandler>
) => lambdaFlowCallback(lambdaEventV1, lambdaContext, () => {});
