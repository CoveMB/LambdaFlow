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
  error?: Error | FlowError;
  statusCode?: number;
  headers?: {
    [header: string]: boolean | number | string;
  };
  body?: Record<string, any>;
  isBase64Encoded?: boolean;
  cookies?: string[];
};
