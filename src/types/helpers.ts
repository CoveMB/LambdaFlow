import { FlowBox } from "./box";
import {
  FlowSyncMiddleware,
  FlowAsyncMiddleware,
  FlowMiddleware,
} from "./middleware";

// Middleware helpers
// @internal
export type HandleAsyncMiddleware = <
  M extends FlowSyncMiddleware<M> | FlowAsyncMiddleware<M>
>(
  middleware: M
) => (box: Promise<FlowBox<M>>) => Promise<FlowBox<M>>;

// @internal
export type ErrorOut = <M extends FlowMiddleware>(
  middleware: M
) => (box: Promise<FlowBox>) => Promise<FlowBox>;
