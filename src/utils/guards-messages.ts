import { FlowBoxWithError, FlowMiddleware } from "../types";

const bodyNotReturned = (middleware: FlowMiddleware) => (failedReturn: any) =>
  console.log(
    `
    Flow Error: Your middleware did not returned a box to be passed on to the next one, instead it returned: ${failedReturn}

    This error has occurred in the following middleware:

    ${middleware.toString()}
    `
  );

const boxMutated = (middleware: FlowMiddleware) => () =>
  console.log(
    `
    Flow Error: Is seems you might be mutating the box, only the state property of the box is allowed to be extended, use it to pass data from one function to an other.

    This error has occurred in the following middleware:

    ${middleware.toString()}
    `
  );

const logError = (errorBox: FlowBoxWithError) =>
  console.log(errorBox.error.error);

export { bodyNotReturned, logError, boxMutated };
