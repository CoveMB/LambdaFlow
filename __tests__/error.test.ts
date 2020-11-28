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
  }, simpleResponse())();

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
  }, simpleResponse())();

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
  }, simpleResponse())();

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
});

it("If an error occur and is not catch it is transform as a basic FlowError", async () => {
  const flow = lambdaFlow((box) => {
    box.statusCode = 899;

    throw new Error("Not found");
  }, simpleResponse())();

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
});

it("If an error callback is supply it execute if an error occurres", async () => {
  let toMutate = "Not mutated";

  const flow = lambdaFlow(() => {
    throw new Error("Not found");
  }, simpleResponse())(() => {
    toMutate = "mutated";
  });

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(toMutate).toBe("mutated");
});

it("If an error callback is supply it does not execute if no error occurres", async () => {
  let toMutate = "Not mutated";

  const flow = lambdaFlow((box) => {
    box.statusCode = 899;
    box.body = "Hello";

    return box;
  })(() => {
    toMutate = "mutated";
  });

  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(899);
  expect(response.body).toBe("Hello");
  expect(toMutate).toBe("Not mutated");
});

it("If an error callback is supply it should not modify the returned box", async () => {
  const flow = lambdaFlow(() => {
    throw new Error("Not found");
  }, simpleResponse())((box) => {
    box.statusCode = 200;
    box.body = "surprise";

    return box;
  });

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
});

it("If an error occurres the other functions of the flow are not run", async () => {
  let toMutate = "Not mutated";

  const flow = lambdaFlow(
    () => {
      throw new Error("Not found");
    },
    (box) => {
      toMutate = "mutated";

      return box;
    }
  )();

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(toMutate).toBe("Not mutated");
});

it("If an error is attached to the box the other functions of the flow are not run", async () => {
  let toMutate = "Not mutated";

  const flow = lambdaFlow(
    (box) => {
      box.error = notFoundError(new Error("Could not find this ressource"));

      return box;
    },
    (box) => {
      toMutate = "mutated";

      return box;
    }
  )();

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(404);
  expect(body.status).toBe("error");
  expect(toMutate).toBe("Not mutated");
});

it("If an error occur in an async function and is not catch it is transform as a basic FlowError", async () => {
  const flow = lambdaFlow(async (box) => {
    await Promise.reject();

    return box;
  }, simpleResponse())();

  const response = await lambdaExecutor(flow);

  const body = JSON.parse(response.body!);

  expect(response.statusCode).toBe(500);
  expect(body.status).toBe("error");
  expect(body.message).toBe("Internal Server Error");
});
