import {
  APIGatewayProxyEventV2,
  Callback,
  APIGatewayProxyResultV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";
import { ErrorCallback } from "./error";
import { FlowMiddleware } from "./middleware";

//  Lambda Flow
export type LambdaFlowCallback = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<APIGatewayProxyResultV2>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type LambdaFlow = (
  ...middlewares: Array<FlowMiddleware>
) => (errorCallback?: ErrorCallback) => LambdaFlowCallback;
