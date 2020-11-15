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
  body?: any;
  status?: number;
  error?: Error;
};

export type LambdaResponse = {
  statusCode: number;
  body: any;
};

export type Middleware = (context: LambdaContext) => LambdaContext;

export type ReturnResponse = (context: LambdaContext) => LambdaResponse;

export type CreateContext = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) => LambdaContext;

export type LambdaFlowCallback = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) => LambdaResponse;

export type LambdaFlow = (...middlewares: Middleware[]) => LambdaFlowCallback;
