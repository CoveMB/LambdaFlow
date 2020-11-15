// contextFlow(simpleSuccess(877))(
//   (lambdaEvent as unknown) as APIGatewayEvent,
//   (lambdaContext as unknown) as Context,
//   ((() => {}) as unknown) as Callback<APIGatewayProxyResult>
// );
import { lambdaFlow, simpleResponse } from "../src";
import { lambdaExecutor } from "./fixtures/helpers";

it("return a stringify body", () => {
  const flow = lambdaFlow(simpleResponse(400));
  const response = lambdaExecutor(flow);

  expect(typeof response.body).toBe("string");
});

it("return a 200 status if not specified", () => {
  const flow = lambdaFlow(simpleResponse());
  const response = lambdaExecutor(flow);

  expect(response.statusCode).toBe(200);
});
