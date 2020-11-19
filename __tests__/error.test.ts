/* eslint-disable fp/no-mutation */
/* eslint-disable no-param-reassign */
import {
  lambdaFlow,
  nonExposedError,
  notFoundError,
  simpleError,
  simpleResponse,
} from "../src";
import { lambdaExecutor } from "./fixtures/helpers";

it("If an error occur during the flow it is returned in the body", async () => {
  const flow = lambdaFlow((box) => {
    try {
      throw new Error("Oups!");

      // eslint-disable-next-line no-unreachable
      return box;
    } catch (error) {
      box.error = simpleError(error);
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
      throw new Error("Not found");

      // eslint-disable-next-line no-unreachable
      return box;
    } catch (error) {
      box.error = notFoundError(error);
    }

    return box;
  }, simpleResponse());

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(404);
  expect(body.status).toBe("error");
  expect(body.message).toBe("Not found");
});

it("If an non exposed FlowError occur during the flow it is return it's message", async () => {
  const flow = lambdaFlow((box) => {
    try {
      throw new Error("Oups!");

      // eslint-disable-next-line no-unreachable
      return box;
    } catch (error) {
      box.error = nonExposedError(403)(error);
    }

    return box;
  }, simpleResponse());

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
});

it("If an error occur and is not catch it is transform as a basic FlowError", async () => {
  const flow = lambdaFlow((box) => {
    throw new Error("Not found");
  }, simpleResponse());

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
});
