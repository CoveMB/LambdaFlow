import * as R from "ramda";

const isErrorExposed = R.propEq("expose", true);

export { isErrorExposed };
