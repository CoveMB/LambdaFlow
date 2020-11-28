/* eslint-disable @typescript-eslint/indent */
import {
  APIGatewayProxyEventV2,
  Callback,
  APIGatewayProxyResultV2,
  APIGatewayProxyStructuredResultV2,
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyHandlerV2,
} from "aws-lambda";
import { ErrorCallback } from "./error";
import { FlowMiddleware } from "./middleware";

//  Lambda Flow
export type LambdaFlowCallback<M> = (
  event: M extends APIGatewayProxyHandlerV2
    ? APIGatewayProxyEventV2
    : APIGatewayProxyEvent,
  context: Context,
  callback: Callback<
    M extends APIGatewayProxyHandlerV2
      ? APIGatewayProxyResultV2
      : APIGatewayProxyResult
  >
) => Promise<
  M extends APIGatewayProxyHandlerV2
    ? APIGatewayProxyStructuredResultV2
    : APIGatewayProxyResult
>;

export type LambdaFlow = <
  M extends
    | APIGatewayProxyHandlerV2
    | APIGatewayProxyHandler = APIGatewayProxyHandlerV2 & APIGatewayProxyHandler
>(
  ...middlewares: Array<FlowMiddleware<M>>
) => (errorCallback?: ErrorCallback) => LambdaFlowCallback<M>;
