import {
  APIGatewayEvent,
  Context,
  Callback,
  APIGatewayProxyResult,
} from "aws-lambda";

export type LambdaContext = {
  event: APIGatewayEvent;
  context: Context;
  callback: Callback<APIGatewayProxyResult>;
  state: any;
  body?: any;
  status?: number;
  error?: Error;
};

export type LambdaResponse = {
  statusCode: number;
  body: any;
};

export type FlowAsyncMiddleware<M> = (context: LambdaContext) => M | Promise<M>;

export type FlowSyncMiddleware<M> = (context: LambdaContext) => M;

export type ResponseMiddleware = (
  context: Promise<LambdaContext>
) => Promise<LambdaResponse>;

export type AsyncMiddleware = FlowAsyncMiddleware<LambdaContext>;

export type SyncMiddleware = FlowSyncMiddleware<LambdaContext>;

export type CreateContext = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) => LambdaContext;

export type HandleAsyncMiddleware = <
  M extends SyncMiddleware | AsyncMiddleware
>(
  middleware: M
) => (context: Promise<LambdaContext>) => Promise<LambdaContext>;

export type LambdaFlowCallback = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) => Promise<LambdaResponse>;

export type Middleware = SyncMiddleware | AsyncMiddleware;

export type LambdaFlow = (
  ...middlewares: Array<Middleware>
) => LambdaFlowCallback;
