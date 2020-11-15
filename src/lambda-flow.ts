import { flow } from "fp-ts/lib/function";
import * as R from "ramda";
import {
  CreateContext,
  LambdaFlow,
  HandleAsyncMiddleware,
  ResponseMiddleware,
} from "./types";

const createContext: CreateContext = (event, context, callback) => ({
  state: {},
  event,
  callback,
  context,
});

const returnResponse: ResponseMiddleware = async (context) => {
  const finalContext = await context;

  return {
    statusCode: finalContext.status || 200,

    body: R.ifElse(R.has("body"), flow(R.prop("body"), JSON.stringify), () =>
      R.empty("")
    )(finalContext),
  };
};

const handleAsyncMiddleware: HandleAsyncMiddleware = (middleware) => async (
  context: any
) => middleware(await context);

const lambdaFlow: LambdaFlow = (...middlewares) =>
  // @ts-ignore
  flow(
    createContext,
    ...R.map(handleAsyncMiddleware)(middlewares),
    returnResponse
  );

export { lambdaFlow };
