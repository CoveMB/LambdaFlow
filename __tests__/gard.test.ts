/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FlowBox } from "../src/types";
import { lambdaFlow } from "../src";
import { lambdaExecutor } from "./fixtures/helpers";

it("A middleware has to return a box", async () => {
  const consoleSpy = jest.spyOn(console, "log");

  const wrongMiddleware = (box: FlowBox): void => {
    box.body = { code: 200 };
  };

  const flow = lambdaFlow(
    (box) => {
      box.statusCode = 200;

      return box;
    },
    // @ts-ignore
    wrongMiddleware
  )();

  const response = await lambdaExecutor(flow);

  console.log(response);

  const body = JSON.parse(response.body!);

  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
  expect(response.statusCode).toBe(500);
  expect(consoleSpy).toHaveBeenCalledWith(
    // @ts-ignore
    `
    Flow Error:

    Your middleware did not returned a box to be passed on to the next one, instead it returned: ${undefined}
    This has occurred in the following middleware:

    ${wrongMiddleware.toString()}
    `
  );
});
