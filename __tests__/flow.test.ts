import { lambdaFlow, simpleResponse } from "../src";
import { lambdaExecutor } from "./fixtures/helpers";

it("Return a stringify body", async () => {
  const flow = lambdaFlow(simpleResponse(201))();
  const response = await lambdaExecutor(flow);

  expect(typeof response.body).toBe("string");
  expect(response.statusCode).toBe(201);
});

it("Simple response return a 200 status if not specified", async () => {
  const flow = lambdaFlow(simpleResponse())();
  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(200);
});

it("Does not return the FlowBox", async () => {
  const flow = lambdaFlow(simpleResponse())();
  const response = await lambdaExecutor(flow);

  // @ts-ignore for test
  expect(response.state).toBe(undefined);
});

it("Should return a base64 encoded flag", async () => {
  const flow = lambdaFlow((box) => {
    box.isBase64Encoded = true;

    return box;
  }, simpleResponse())();

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
  )();

  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(200);
  expect(response.body!).toBe(JSON.stringify(bodyToReturn));
});

it("If no body no body is returned", async () => {
  const flow = lambdaFlow((box) => box)();
  const response = await lambdaExecutor(flow);

  expect(typeof response.body).toBe("undefined");
  expect(response.statusCode).toBe(200);
});

it("If I modify the status I get a modified status response", async () => {
  const flow = lambdaFlow((box) => {
    box.statusCode = 345;

    return box;
  })();
  const response = await lambdaExecutor(flow);

  expect(typeof response.body).toBe("undefined");
  expect(response.statusCode).toBe(345);
});

it("If a body is a string it is return as it is", async () => {
  const flow = lambdaFlow((box) => {
    box.statusCode = 676;
    box.body = "Hello";

    return box;
  })();

  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(676);
  expect(response.body).toBe("Hello");
});

it("If a body is a number it is return as string", async () => {
  const flow = lambdaFlow((box) => {
    box.statusCode = 676;
    box.body = 678;

    return box;
  })();

  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(676);
  expect(response.body).toBe("678");
});
