import {
  Context,
  Callback,
  APIGatewayProxyStructuredResultV2,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

// Context
export type LambdaContext = APIGatewayProxyStructuredResultV2 & {
  event: APIGatewayProxyEventV2;
  context: Context;
  callback: Callback<APIGatewayProxyResultV2>;
  state: any;
  error?: Error;
};

// Middleware type
export type ResponseMiddleware = (
  context: Promise<LambdaContext>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type FlowAsyncMiddleware = (
  context: LambdaContext
) => LambdaContext | Promise<LambdaContext>;

export type FlowSyncMiddleware = (context: LambdaContext) => LambdaContext;

export type FlowMiddleware = FlowSyncMiddleware | FlowAsyncMiddleware;

// Flow middleware
export type CreateContext = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<APIGatewayProxyResultV2>
) => LambdaContext;

// Middleware helpers
export type HandleAsyncMiddleware = <
  M extends FlowSyncMiddleware | FlowAsyncMiddleware
>(
  middleware: M
) => (context: Promise<LambdaContext>) => Promise<LambdaContext>;

//  Lambda Flow
export type LambdaFlowCallback = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<APIGatewayProxyResultV2>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type LambdaFlow = (
  ...middlewares: Array<FlowMiddleware>
) => LambdaFlowCallback;
