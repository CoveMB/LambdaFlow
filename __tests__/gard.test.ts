import { FlowBox } from "../src/types";
import { lambdaFlow } from "../src";
import { lambdaExecutor } from "./fixtures/helpers";

it("A middleware has to return a box", async () => {
  const originalLog = console.log;

  console.log = jest.fn();

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

  const body = JSON.parse(response.body!);

  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
  expect(response.statusCode).toBe(500);
  expect(console.log).toHaveBeenCalledWith(
    `
    Flow Error: Your middleware did not returned a box to be passed on to the next one, instead it returned: ${undefined}

    This error has occurred in the following middleware:

    ${wrongMiddleware.toString()}
    `
  );

  console.log = originalLog;
});

it("Only allowed key of box can be mutated", async () => {
  const originalLog = console.log;

  console.log = jest.fn();

  const wrongMiddleware = (box: FlowBox) => {
    box.statusCode = 200;
    box.body = { name: true };
    // @ts-ignore
    box.mutation = 9;

    return box;
  };

  const flow = lambdaFlow(wrongMiddleware)();

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(body.message).toBe("Internal Server Error");
  expect(response.statusCode).toBe(500);
  expect(console.log).toHaveBeenCalledWith(
    `
    Flow Error: Is seems you might be mutating the box, only the state property of the box is allowed to be extended, use it to pass data from one function to an other.

    This error has occurred in the following middleware:

    ${wrongMiddleware.toString()}
    `
  );
  console.log = originalLog;
});
