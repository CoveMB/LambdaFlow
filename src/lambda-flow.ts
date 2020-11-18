import { debugLog } from "@bjmrq/utils";
import { flow, pipe } from "fp-ts/lib/function";
import * as R from "ramda";
import { assocIfHas, bodyLens, statusLens, messageLens } from "utils/object";
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
    R.over(
      bodyLens,
      flow(
        () => R.identity({ status: "error" }),
        R.over(
          messageLens,
          R.ifElse(
            () => R.pathEq(["error", "expose"], true)(finalBox),
            () => R.path(["error", "error", "message"])(finalBox),
            () => "Internal Server Error"
          )
        ),
        JSON.stringify
      )
    ),
    R.over(
      statusLens,
      R.ifElse(
        () => R.pathEq(["error", "expose"], true)(finalBox),
        () => R.path(["error", "code"])(finalBox),
        () => 500
      )
    )
  );

const successResponse = (finalBox: FlowBox) =>
  flow(
    assocIfHas("isBase64Encoded", finalBox),
    // Make it lens
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
