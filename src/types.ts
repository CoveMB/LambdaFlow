import {
  Context,
  Callback,
  APIGatewayProxyStructuredResultV2,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

export type LambdaContext = APIGatewayProxyStructuredResultV2 & {
  event: APIGatewayProxyEventV2;
  context: Context;
  callback: Callback<APIGatewayProxyResultV2>;
  state: any;
  error?: Error;
};

export type FlowAsyncMiddleware<M> = (context: LambdaContext) => M | Promise<M>;

export type FlowSyncMiddleware<M> = (context: LambdaContext) => M;

export type ResponseMiddleware = (
  context: Promise<LambdaContext>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type AsyncMiddleware = FlowAsyncMiddleware<LambdaContext>;

export type SyncMiddleware = FlowSyncMiddleware<LambdaContext>;

export type CreateContext = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<APIGatewayProxyResultV2>
) => LambdaContext;

export type HandleAsyncMiddleware = <
  M extends SyncMiddleware | AsyncMiddleware
>(
  middleware: M
) => (context: Promise<LambdaContext>) => Promise<LambdaContext>;

export type LambdaFlowCallback = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<APIGatewayProxyResultV2>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type Middleware = SyncMiddleware | AsyncMiddleware;

export type LambdaFlow = (
  ...middlewares: Array<Middleware>
) => LambdaFlowCallback;
