import { debugLog } from "@bjmrq/utils";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { flow, pipe } from "fp-ts/lib/function";
import { simpleResponse } from "helpers-middlewares";
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

  return pipe(
    R.empty({}),
    R.assoc("statusCode", finalContext.statusCode),
    R.assoc(
      "body",
      R.ifElse(R.has("body"), flow(R.prop("body"), JSON.stringify), () =>
        R.empty("")
      )(finalContext)
    ),
    R.assoc(
      "headers",
      R.ifElse(R.has("headers"), R.prop("headers"), () => R.empty(""))(
        finalContext
      )
    ),
    R.assoc(
      "cookies",
      R.ifElse(R.has("cookies"), R.prop("cookies"), () => R.empty(""))(
        finalContext
      )
    ),
    R.assoc(
      "isBase64Encoded",
      R.ifElse(
        R.has("isBase64Encoded"),
        R.prop("isBase64Encoded"),
        () => false
      )(finalContext)
    )
  );
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
