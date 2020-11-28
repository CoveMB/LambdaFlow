/* eslint-disable @typescript-eslint/indent */
import {
  Context,
  Callback,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  APIGatewayProxyEvent,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { FlowError } from "./error";

export type FlowBoxBase<M> = {
  event: M extends APIGatewayProxyHandlerV2
    ? APIGatewayProxyEventV2
    : APIGatewayProxyEvent;
  context: Context;
  callback: Callback<APIGatewayProxyResultV2>;
  state: any;
};

export type FlowBox<
  M = APIGatewayProxyHandlerV2 & APIGatewayProxyHandler
> = FlowBoxBase<M> & {
  error?: FlowError;
  statusCode: number;
  headers: {
    [header: string]: boolean | number | string;
  };
  body: any;
  isBase64Encoded: boolean;
  cookies: M extends APIGatewayProxyHandlerV2 ? string[] : null;
  multiValueHeaders: M extends APIGatewayProxyHandler
    ? {
        [header: string]: Array<boolean | number | string>;
      }
    : null;
};

export type FlowBoxWithError = FlowBox & {
  error: FlowError;
};

export type FlowBoxWithResponse = FlowBox & {
  response: APIGatewayProxyResultV2;
};
