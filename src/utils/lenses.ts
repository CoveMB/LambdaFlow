/* eslint-disable @typescript-eslint/indent */
import * as R from "ramda";
import { FlowBox, FlowBoxWithResponse } from "types";

const bodyLens = R.lensProp("body");
const statusLens = R.lensProp("statusCode");
const messageLens = R.lensProp("message");

const toStatusResponseLens = R.lens<
  FlowBox,
  FlowBox["statusCode"],
  FlowBoxWithResponse
  // @ts-ignore
>(R.prop("statusCode"), R.assocPath(["response", "statusCode"]));

const toCookiesResponseLens = R.lens<
  FlowBox,
  FlowBox["cookies"],
  FlowBoxWithResponse
  // @ts-ignore
>(R.prop("cookies"), R.assocPath(["response", "cookies"]));

const toIsEncodedResponseLens = R.lens<
  FlowBox,
  FlowBox["isBase64Encoded"],
  FlowBoxWithResponse
  // @ts-ignore
>(R.prop("isBase64Encoded"), R.assocPath(["response", "isBase64Encoded"]));

const toHeadersResponseLens = R.lens<
  FlowBox,
  FlowBox["headers"],
  FlowBoxWithResponse
  // @ts-ignore
>(R.prop("headers"), R.assocPath(["response", "headers"]));

const toBodyErrorResponseLens = R.lens<
  FlowBox,
  FlowBox["error"],
  FlowBoxWithResponse
>(R.path(["error"]), R.assocPath(["response", "body"]));

const toBodySuccessResponseLens = R.lens<
  FlowBox,
  FlowBox["body"],
  FlowBoxWithResponse
>(R.path(["body"]), R.assocPath(["response", "body"]));

const toStatusCodeErrorResponseLens = R.lens<
  FlowBox,
  FlowBox["error"],
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
