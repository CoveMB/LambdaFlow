import {
  APIGatewayProxyEventV2,
  Callback,
  APIGatewayProxyResultV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { Context } from "vm";
import { FlowMiddleware } from "./middleware";

//  Lambda Flow
export type LambdaFlowCallback = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<APIGatewayProxyResultV2>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type LambdaFlow = (
  ...middlewares: Array<FlowMiddleware>
) => LambdaFlowCallback;
