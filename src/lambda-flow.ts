import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { flow, pipe } from "fp-ts/lib/function";
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
const errorResponse = flow(
  R.over(
    toBodyErrorResponseLens,
    flow(
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
const successResponse = flow(
  R.over(toIsEncodedResponseLens, R.identity),
  R.over(toStatusResponseLens, R.unless(R.is(Number), R.always(200))),
  R.over(
    toBodySuccessResponseLens,
    R.unless(R.equals(undefined), R.unless(R.is(String), JSON.stringify))
  )
);

// @internal
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

// @internal
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

// @internal
const notCatchedErrors = (middleware: FlowMiddleware) => (
  error: Error,
  errorBox: FlowBoxWithError
) =>
  pipe(
    errorBox,
    R.assoc("error", enhancedErrors(middleware)(error)),
    R.tap(logError)
  );

// @internal
const errorOut: ErrorOut = (middleware) => async (box) =>
  // @ts-expect-error
  flow(
    R.unless(
      flow(R.prop("error"), R.is(Object)),
      // TODO have a look at ramda otherwise
      tryCatchAsync(
        // @ts-expect-error
        flow(middleware, validateBoxState(middleware)),
        notCatchedErrors(middleware)
      )
    )
    // @ts-expect-error
  )(await box);

// @internal
const errorCallbackHandler: ErrorCallbackHandler = (errorCallback) => async (
  box
) =>
  // @ts-expect-error
  R.when(
    flow(R.prop("error"), R.is(Object)),
    // @ts-expect-error
    flow(R.clone, errorCallback, R.always(await box))
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
  flow(
    createBox,
    // @ts-expect-error
    ...R.map(errorOut)(middlewares),
    errorCallbackHandler(errorCallback),
    returnResponse
  );

export { lambdaFlow };
