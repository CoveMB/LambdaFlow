import {
  Context,
  Callback,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { FlowError } from "./error";

// Context
export type FlowBox = {
  event: APIGatewayProxyEventV2;
  context: Context;
  callback: Callback<APIGatewayProxyResultV2>;
  state: any;
  error?: FlowError;
  statusCode?: number;
  headers?: {
    [header: string]: boolean | number | string;
  };
  body?: any;
  isBase64Encoded?: boolean;
  cookies?: string[];
};

export type FlowBoxWithError = FlowBox & {
  error: FlowError;
};

export type FlowBoxWithResponse = FlowBox & {
  response: APIGatewayProxyResultV2;
};
