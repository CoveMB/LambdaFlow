import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { FlowBox } from "./context";

// Middleware type
export type ResponseMiddleware = (
  flowBox: Promise<FlowBox>
) => Promise<APIGatewayProxyStructuredResultV2>;

export type FlowAsyncMiddleware = (context: FlowBox) => Promise<FlowBox>;

export type FlowSyncMiddleware = (context: FlowBox) => FlowBox;

export type FlowErrorSyncMiddleware = (context: FlowBox) => FlowBox | Error;

export type FlowErrorAsyncMiddleware = (
  context: FlowBox
) => Promise<FlowBox> | Promise<Error>;

export type FlowMiddleware = FlowSyncMiddleware | FlowAsyncMiddleware;
