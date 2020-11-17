import { flow, pipe } from "fp-ts/lib/function";
import * as R from "ramda";
import { FlowError } from "types/error";
import { assocIfHas } from "utils/object";
import {
  CreateBox,
  LambdaFlow,
  ResponseMiddleware,
  ErrorOut,
  FlowBox,
} from "./types";

const createBox: CreateBox = (event, context, callback) => ({
  state: {},
  event,
  callback,
  context,
});

const errorResponse = (finalBox: FlowBox) =>
  flow(
    R.assoc(
      "body",
      pipe(
        R.identity({ status: "error" }),
        R.assoc(
          "message",
          R.ifElse(
            (error) => R.is(FlowError)(error) && error.expose,
            R.prop("message"),
            () => "Internal Server Error"
          )(finalBox.error)
        ),
        JSON.stringify
      )
    ),
    R.assoc(
      "statusCode",
      R.ifElse(
        (error) => R.is(FlowError)(error) && error.expose,
        (flowError) => flowError.status,
        () => 500
      )(finalBox.error)
    )
  );

const successResponse = (finalBox: FlowBox) =>
  flow(
    assocIfHas("isBase64Encoded", finalBox),
    R.assoc(
      "body",
      R.ifElse(
        R.has("body"),
        flow(R.prop("body"), JSON.stringify),
        () => undefined
      )(finalBox)
    ),
    R.assoc("statusCode", finalBox.statusCode || 200)
  );

const returnResponse: ResponseMiddleware = async (box) => {
  const finalBox = await box;

  return pipe(
    () => R.empty({}),
    assocIfHas("headers", finalBox),
    assocIfHas("cookies", finalBox),
    R.ifElse(
      () => R.has("error")(finalBox),
      errorResponse(finalBox),
      successResponse(finalBox)
    )
  );
};

const errorOut: ErrorOut = (middleware) => async (box) =>
  R.unless(R.has("error"), middleware)(await box);

const lambdaFlow: LambdaFlow = (...middlewares) =>
  // @ts-ignore
  flow(createBox, ...R.map(errorOut)(middlewares), returnResponse);

export { lambdaFlow };
