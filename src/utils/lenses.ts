/* eslint-disable @typescript-eslint/indent */
import * as R from "ramda";
import { FlowBox, FlowBoxForResponse, FlowBoxWithResponse } from "types";

const bodyLens = R.lensProp("body");
const statusLens = R.lensProp("statusCode");
const messageLens = R.lensProp("message");

const toStatusResponseLens = R.lens<
  FlowBoxForResponse,
  FlowBoxForResponse["statusCode"],
  FlowBoxWithResponse
>(R.prop("statusCode"), R.assocPath(["response", "statusCode"]));

const toCookiesResponseLens = R.lens<
  FlowBoxForResponse,
  FlowBoxForResponse["cookies"],
  FlowBoxWithResponse
>(R.prop("cookies"), R.assocPath(["response", "cookies"]));

const toIsEncodedResponseLens = R.lens<
  FlowBoxForResponse,
  FlowBoxForResponse["isBase64Encoded"],
  FlowBoxWithResponse
>(R.prop("isBase64Encoded"), R.assocPath(["response", "isBase64Encoded"]));

const toHeadersResponseLens = R.lens<
  FlowBoxForResponse,
  FlowBoxForResponse["headers"],
  FlowBoxWithResponse
>(R.prop("headers"), R.assocPath(["response", "headers"]));

const toBodyErrorResponseLens = R.lens<
  FlowBoxForResponse,
  FlowBoxForResponse["error"],
  FlowBoxWithResponse
>(R.path(["error"]), R.assocPath(["response", "body"]));

const toBodySuccessResponseLens = R.lens<
  FlowBoxForResponse,
  FlowBoxForResponse["body"],
  FlowBoxWithResponse
>(R.path(["body"]), R.assocPath(["response", "body"]));

const toStatusCodeErrorResponseLens = R.lens<
  FlowBoxForResponse,
  FlowBoxForResponse["error"],
  FlowBoxWithResponse
>(R.path(["error"]), R.assocPath(["response", "statusCode"]));

const responseLens = R.lensProp("response");

export {
  toHeadersResponseLens,
  bodyLens,
  statusLens,
  messageLens,
  responseLens,
  toStatusResponseLens,
  toCookiesResponseLens,
  toBodyErrorResponseLens,
  toStatusCodeErrorResponseLens,
  toIsEncodedResponseLens,
  toBodySuccessResponseLens,
};
