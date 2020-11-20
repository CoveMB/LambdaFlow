import { lambdaFlow } from "../src";
import { lambdaExecutor } from "./fixtures/helpers";

it("A middleware has to return a box", async () => {
  // @ts-ignore
  const flow = lambdaFlow((box) => {
    box.statusCode = 200;
  })();
  const response = await lambdaExecutor(flow);

  expect(typeof response.body).toBe("string");
  expect(response.statusCode).toBe(201);
});
