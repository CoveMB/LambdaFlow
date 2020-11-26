import { FlowMiddleware } from "../types";

const bodyNotReturned = (middleware: FlowMiddleware) => (failedReturn: any) =>
  console.log(
    `
    Flow Error:

    Your middleware did not returned a box to be passed on to the next one, instead it returned: ${failedReturn}
    This has occurred in the following middleware:

    ${middleware.toString()}
    `
  );

export { bodyNotReturned };
