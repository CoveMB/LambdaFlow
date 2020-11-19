import { debugLog } from "@bjmrq/utils";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { flow } from "fp-ts/lib/function";
import { simpleError } from "helpers";
import * as R from "ramda";
import {
  toStatusCodeErrorResponseLens,
  responseLens,
  toCookiesResponseLens,
  toHeadersResponseLens,
  toBodyErrorResponseLens,
  toIsEncodedResponseLens,
  toStatusResponseLens,
  toBodySuccessResponseLens,
} from "utils/lenses";
import { isErrorExposed } from "utils/props";
import {
  CreateBox,
  LambdaFlow,
  ResponseMiddleware,
  ErrorOut,
  FlowErrorSyncMiddleware,
  FlowBox,
} from "./types";

const createBox: CreateBox = (event, context, callback) => ({
  state: {},
  event,
  callback,
  context,
});

const errorResponse = flow(
  R.over(
    toBodyErrorResponseLens,
    flow(
      R.ifElse(
        isErrorExposed,
        R.path(["error", "message"]),
        // R.always
        R.always("Internal Server Error")
      ),
      R.assoc("message", R.__, {}),
      R.assoc("status", "error"),
      JSON.stringify
    )
  ),
  R.over(
    toStatusCodeErrorResponseLens,
    R.ifElse(isErrorExposed, R.prop("code"), R.always(500))
  )
);

const successResponse = flow(
  R.over(toIsEncodedResponseLens, R.identity),
  R.over(toStatusResponseLens, R.unless(R.is(Number), R.always(200))),
  R.over(
    toBodySuccessResponseLens,
    R.unless(R.equals(undefined), flow(R.identity, JSON.stringify))
  )
);

const returnResponse: ResponseMiddleware = async (box) =>
  flow(
    R.set(responseLens, {}),
    R.over(toCookiesResponseLens, R.identity),
    R.over(toHeadersResponseLens, R.identity),
    R.ifElse(R.has("error"), errorResponse, successResponse),
    R.prop("response")
  )(await box) as Promise<APIGatewayProxyStructuredResultV2>;

const errorOut: ErrorOut = (middleware) => async (box) =>
  R.unless(
    R.has("error"),
    // @ts-ignore
    R.tryCatch(middleware, (error: Error, errorBox) =>
      R.assoc("error", simpleError(error))(errorBox)
    )
  )(await box);

const lambdaFlow: LambdaFlow = (...middlewares) =>
  // @ts-ignore
  flow(createBox, ...R.map(errorOut)(middlewares), returnResponse);

export { lambdaFlow };
