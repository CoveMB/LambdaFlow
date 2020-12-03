import { flow } from "fp-ts/lib/function";
import * as R from "ramda";
import { FlowMiddleware } from "../types";
import { simpleError } from "../helpers/helpers-error";
import { boxMutated } from "./guards-messages";

const enhancedErrors = (middleware: FlowMiddleware) =>
  R.ifElse(
    flow(
      // @ts-ignore
      R.prop("message"),
      R.includes("object is not extensible")
    ),
    flow(R.tap(boxMutated(middleware)), simpleError),
    simpleError
  );

export default enhancedErrors;
