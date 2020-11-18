import * as R from "ramda";

const assocIfHas = (key: string, object: Record<string, any>) =>
  R.assoc(key, R.prop(key)(object));

const bodyLens = R.lensProp("body");
const statusLens = R.lensProp("statusCode");
const messageLens = R.lensProp("message");

export { assocIfHas, bodyLens, statusLens, messageLens };
