import { flow } from "fp-ts/lib/function";
import * as R from "ramda";
import { FlowMiddleware } from "./types";

const simpleResponse = (status = 200): FlowMiddleware =>
  flow(R.assoc("statusCode", status), R.assoc("body", { status: "success" }));

export { simpleResponse };
