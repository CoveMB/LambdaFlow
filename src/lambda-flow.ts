import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
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
import enhancedErrors from "./utils/guards-reasons";

// @internal
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

// @internal
const errorResponse = R.pipe(
  R.over(
    toBodyErrorResponseLens,
    R.pipe(
      R.ifElse(
        isErrorExposed,
        R.prop("message"),
        R.always("Internal Server Error")
      ),
      R.assoc("message", R.__, {}),
      R.assoc("status", "error"),
      R.unless(R.is(String), JSON.stringify)
    )
  ),
  R.over(
    toStatusCodeErrorResponseLens,
    R.ifElse(isErrorExposed, R.prop("statusCode"), R.always(500))
  )
);

// @internal
const successResponse = R.pipe(
  R.over(toIsEncodedResponseLens, R.identity),
  R.over(toStatusResponseLens, R.unless(R.is(Number), R.always(200))),
  R.over(
    toBodySuccessResponseLens,
    R.unless(R.equals(undefined), R.unless(R.is(String), JSON.stringify))
  )
);

// @internal
const returnResponse: ResponseMiddleware = async (box) =>
  R.pipe(
    R.set(responseLens, {}),
    R.over(toCookiesResponseLens, R.identity),
    R.over(toHeadersResponseLens, R.identity),
    R.over(toMultiValueHeadersResponseLens, R.identity),
    R.ifElse(
      R.pipe(R.prop("error"), R.is(Object)),
      errorResponse,
      successResponse
    ),
    R.prop("response")
  )(await box) as Promise<APIGatewayProxyStructuredResultV2>;

// @internal
const validateBoxState = (middleware: FlowMiddleware) =>
  R.unless(
    R.is(Object),
    R.pipe(
      R.tap(bodyNotReturned(middleware)),
      R.always({
        error: {
          code: 500,
        },
      })
    )
  );

// @internal
const notCatchedErrors = (middleware: FlowMiddleware) => (
  error: Error,
  errorBox: FlowBoxWithError
) =>
  R.pipe(
    // @ts-expect-error
    R.assoc("error", enhancedErrors(middleware)(error)),
    R.tap(logError)
    // @ts-expect-error
  )(errorBox);

// @internal
const errorOut: ErrorOut = (middleware) => async (box) =>
  // @ts-expect-error
  R.pipe(
    R.unless(
      // @ts-expect-error
      R.pipe(R.prop("error"), R.is(Object)),
      // TODO have a look at ramda otherwise
      tryCatchAsync(
        // @ts-expect-error
        R.pipe(middleware, validateBoxState(middleware)),
        notCatchedErrors(middleware)
      )
    )
  )(await box);

// @internal
const errorCallbackHandler: ErrorCallbackHandler = (errorCallback) => async (
  box
) =>
  // @ts-expect-error
  R.when(
    // @ts-expect-error
    R.pipe(R.prop("error"), R.is(Object)),
    R.pipe(R.clone, errorCallback, R.always(await box))
    // @ts-expect-error
  )(await box);

/**
 * Will process the APIGateway event through your middlewares and then return it's response
 * @param {Array<FlowMiddleware<M>>} ...middlewares - All the middleware that will process your APIGateway event
 * @returns {APIGatewayProxyResultV2 | APIGatewayProxyResult} - The response to be return the APIGateway
 */
const lambdaFlow: LambdaFlow = (...middlewares) => (
  errorCallback = R.identity
) =>
  // @ts-expect-error
  R.pipe(
    createBox,
    // @ts-expect-error
    ...R.map(errorOut)(middlewares),
    errorCallbackHandler(errorCallback),
    returnResponse
  );

export { lambdaFlow };
