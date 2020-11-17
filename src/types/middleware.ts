import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { FlowBox } from "./context";

// Middleware type
export type ResponseMiddleware = (
  context: Promise<FlowBox>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type FlowAsyncMiddleware = (
  context: FlowBox
) => FlowBox | Promise<FlowBox>;

export type FlowSyncMiddleware = (context: FlowBox) => FlowBox;

export type FlowMiddleware = FlowSyncMiddleware | FlowAsyncMiddleware;
