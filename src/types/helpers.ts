import { FlowBox } from "./box";
import { FlowSyncMiddleware, FlowAsyncMiddleware } from "./middleware";

// Middleware helpers
export type HandleAsyncMiddleware = <
  M extends FlowSyncMiddleware | FlowAsyncMiddleware
>(
  middleware: M
) => (context: Promise<FlowBox>) => Promise<FlowBox>;

export type ErrorOut = <M extends FlowSyncMiddleware | FlowAsyncMiddleware>(
  middleware: M
) => (context: Promise<FlowBox>) => Promise<FlowBox>;
