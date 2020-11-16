import { lambdaFlow, simpleResponse } from "../src";
import { lambdaExecutor } from "./fixtures/helpers";

it("return a stringify body", async () => {
  const flow = lambdaFlow(simpleResponse(400));
  const response = await lambdaExecutor(flow);

  console.log(response);

  expect(typeof response.body).toBe("string");
});

it("return a 200 status if not specified", async () => {
  const flow = lambdaFlow(simpleResponse());
  const response = await lambdaExecutor(flow);

  expect(response.statusCode).toBe(200);
});
