import { FlowBox } from "./box";
import {
  FlowSyncMiddleware,
  FlowAsyncMiddleware,
  FlowMiddleware,
} from "./middleware";

// Middleware helpers
export type HandleAsyncMiddleware = <
  M extends FlowSyncMiddleware | FlowAsyncMiddleware
>(
  middleware: M
) => (box: Promise<FlowBox>) => Promise<FlowBox>;

export type ErrorOut = <M extends FlowMiddleware>(
  middleware: M
) => (box: Promise<FlowBox>) => Promise<FlowBox>;
