/* eslint-disable fp/no-mutation */
/* eslint-disable no-param-reassign */
import { lambdaFlow, simpleResponse } from "../src";
import { ExposedError, NonExposedError } from "./fixtures/error";
import { lambdaExecutor } from "./fixtures/helpers";

it("return a stringify body", async () => {
  const flow = lambdaFlow(simpleResponse(400));
  const response = await lambdaExecutor(flow);

  expect(typeof response.body).toBe("string");
});

it("Simple response return a 200 status if not specified", async () => {
  const flow = lambdaFlow(simpleResponse());
  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(200);
});

it("Does not return the FlowBox", async () => {
  const flow = lambdaFlow(simpleResponse());
  const response = await lambdaExecutor(flow);

  // @ts-ignore for test
  expect(response.state).toBe(undefined);
});

it("If an error occur during the flow it is returned in the body", async () => {
  const flow = lambdaFlow((box) => {
    try {
      // eslint-disable-next-line fp/no-throw
      throw new Error("Oups!");

      // eslint-disable-next-line no-unreachable
      return box;
    } catch (error) {
      box.error = error;
    }

    return box;
  }, simpleResponse());

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
});

it("If an exposed FlowError occur during the flow it is return it's message", async () => {
  const flow = lambdaFlow((box) => {
    try {
      // eslint-disable-next-line fp/no-throw
      throw new ExposedError("Oups!");

      // eslint-disable-next-line no-unreachable
      return box;
    } catch (error) {
      box.error = error;
    }

    return box;
  }, simpleResponse());

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(405);
  expect(body.status).toBe("error");
  expect(body.message).toBe("The exposed message is: Oups!");
});

it("If an non exposed FlowError occur during the flow it is return it's message", async () => {
  const flow = lambdaFlow((box) => {
    try {
      // eslint-disable-next-line fp/no-throw
      throw new NonExposedError("Oups!");

      // eslint-disable-next-line no-unreachable
      return box;
    } catch (error) {
      box.error = error;
    }

    return box;
  }, simpleResponse());

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
});

it("Should return a base64 encoded flag", async () => {
  const flow = lambdaFlow((box) => {
    box.isBase64Encoded = true;

    return box;
  }, simpleResponse());

  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(200);
  expect(response.isBase64Encoded).toBe(true);
});

it("Should return body from middleware", async () => {
  const bodyToReturn = { test: "bip", success: true };

  const flow = lambdaFlow(
    (box) => {
      box.state = bodyToReturn;

      return box;
    },
    (box) => {
      box.body = bodyToReturn;

      return box;
    },
    (box) => {
      box.state.else = "something";

      return box;
    }
  );

  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(200);
  expect(response.body!).toBe(JSON.stringify(bodyToReturn));
});
