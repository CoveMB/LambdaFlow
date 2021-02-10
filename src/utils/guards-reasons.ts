import * as R from "ramda";
import { FlowMiddleware } from "../types";
import { simpleError } from "../helpers/helpers-error";
import { boxMutated } from "./guards-messages";

const enhancedErrors = (middleware: FlowMiddleware) =>
  R.ifElse(
    R.pipe(R.prop("message"), R.includes("object is not extensible")),
    R.pipe(R.tap(boxMutated(middleware)), simpleError),
    simpleError
  );

export default enhancedErrors;
