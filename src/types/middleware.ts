import {
  APIGatewayProxyHandler,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { FlowBox } from "./box";

// Middleware type
export type ResponseMiddleware = (
  flowBox: Promise<FlowBox>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type FlowAsyncMiddleware<M> = (
  context: FlowBox<M>
) => Promise<FlowBox<M>>;

export type FlowSyncMiddleware<M> = (context: FlowBox<M>) => FlowBox<M>;

export type FlowErrorSyncMiddleware<M> = (
  context: FlowBox<M>
) => FlowBox<M> | Error;

export type FlowErrorAsyncMiddleware<M> = (
  context: FlowBox<M>
) => Promise<FlowBox<M>> | Promise<Error>;

export type FlowMiddleware<
  M = APIGatewayProxyHandlerV2 & APIGatewayProxyHandler
> = FlowSyncMiddleware<M> | FlowAsyncMiddleware<M>;
