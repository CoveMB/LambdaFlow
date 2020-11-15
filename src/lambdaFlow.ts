import { flow } from "fp-ts/lib/function";
import * as R from "ramda";
import { CreateContext, ReturnResponse, LambdaFlow } from "types";

const createContext: CreateContext = (event, context, callback) => ({
  event,
  callback,
  context,
});

const returnResponse: ReturnResponse = (context) => ({
  statusCode: context.status || 200,

  body: R.ifElse(R.has("body"), flow(R.prop("body"), JSON.stringify), () =>
    R.empty("")
  )(context),
});

const lambdaFlow: LambdaFlow = (...middlewares) =>
  // @ts-ignore
  flow(createContext, ...middlewares, returnResponse);

export { lambdaFlow };
