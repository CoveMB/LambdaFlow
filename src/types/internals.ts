import {
  APIGatewayProxyEventV2,
  Callback,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import { FlowBox } from "./context";

export type CreateBox = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<APIGatewayProxyResultV2>
) => FlowBox;
