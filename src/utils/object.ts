import * as R from "ramda";

const assocIfHas = (key: string, object: Record<string, any>) =>
  R.assoc(key, R.prop(key)(object));

export { assocIfHas };
