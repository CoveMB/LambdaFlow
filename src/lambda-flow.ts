import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { flow } from "fp-ts/lib/function";
import { simpleError } from "./helpers";
import * as R from "ramda";
import { ErrorCallbackHandler } from "./types/error";
import { tryCatchAsync } from "@bjmrq/utils";
import { bodyNotReturned, logError } from "./utils/guards-messages";
import {
  toStatusCodeErrorResponseLens,
  responseLens,
  toCookiesResponseLens,
  toHeadersResponseLens,
  toBodyErrorResponseLens,
  toIsEncodedResponseLens,
  toStatusResponseLens,
  toBodySuccessResponseLens,
  toMultiValueHeadersResponseLens,
} from "./utils/lenses";
import { isErrorExposed } from "./utils/props";
import {
  CreateBox,
  LambdaFlow,
  ResponseMiddleware,
  ErrorOut,
  FlowMiddleware,
  FlowBoxWithError,
} from "./types";

const createBox: CreateBox = (event, context, callback) =>
  Object.seal({
    state: {},
    event,
    callback,
    context,
    body: undefined,
    isBase64Encoded: false,
    cookies: undefined,
    error: undefined,
    statusCode: undefined,
    headers: undefined,
    multiValueHeaders: undefined,
  });

const errorResponse = flow(
  R.over(
    toBodyErrorResponseLens,
    flow(
      R.ifElse(
        isErrorExposed,
        R.path(["error", "message"]),
        R.always("Internal Server Error")
      ),
      R.assoc("message", R.__, {}),
      R.assoc("status", "error"),
      R.unless(R.is(String), JSON.stringify)
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
    R.unless(R.equals(undefined), R.unless(R.is(String), JSON.stringify))
  )
);

const returnResponse: ResponseMiddleware = async (box) =>
  flow(
    R.set(responseLens, {}),
    R.over(toCookiesResponseLens, R.identity),
    R.over(toHeadersResponseLens, R.identity),
    R.over(toMultiValueHeadersResponseLens, R.identity),
    R.ifElse(
      flow(R.prop("error"), R.is(Object)),
      errorResponse,
      successResponse
    ),
    R.prop("response")
  )(await box) as Promise<APIGatewayProxyStructuredResultV2>;

const validateBoxState = (middleware: FlowMiddleware) =>
  R.unless(
    R.is(Object),
    flow(
      R.tap(bodyNotReturned(middleware)),
      R.always({
        error: {
          code: 500,
        },
      })
    )
  );

const notCatchedErrors = (error: Error, errorBox: FlowBoxWithError) =>
  // @ts-ignore
  flow(R.assoc("error", simpleError(error)), R.tap(logError))(errorBox);

const errorOut: ErrorOut = (middleware) => async (box) =>
  // @ts-ignore
  flow(
    // @ts-ignore
    R.unless(
      flow(R.prop("error"), R.is(Object)),
      // @ts-ignore
      tryCatchAsync(
        // @ts-ignore
        flow(middleware, validateBoxState(middleware)),
        notCatchedErrors
      )
    )
    // @ts-ignore
  )(await box);

const errorCallbackHandler: ErrorCallbackHandler = (errorCallback) => async (
  box
) =>
  // @ts-ignore
  R.when(
    flow(R.prop("error"), R.is(Object)),
    // @ts-ignore
    flow(R.clone, errorCallback, R.always(await box))
  )(await box);

const lambdaFlow: LambdaFlow = (...middlewares) => (
  errorCallback = R.identity
) =>
  // @ts-ignore
  flow(
    createBox,
    // @ts-ignore
    ...R.map(errorOut)(middlewares),
    errorCallbackHandler(errorCallback),
    returnResponse
  );

export { lambdaFlow };
