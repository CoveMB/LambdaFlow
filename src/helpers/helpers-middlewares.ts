import * as R from "ramda";
import { FlowMiddleware } from "../types/middleware";

/**
 * Help you build a simple response to be returned to the user, will attach the status code you passed on the box with a {status = "success"} on the body of the response
 * @param {string | Error} [status=200] - the message or the error itself, if an error is passed it's message property will be used in the response (default 200)
 * @returns {FlowMiddleware} The middleware that will attach the status code you passed on the box with a {status = "success"} on the body
 */
const simpleResponse = (status = 200): FlowMiddleware =>
  R.pipe(R.assoc("statusCode", status), R.assoc("body", { status: "success" }));

export { simpleResponse };
