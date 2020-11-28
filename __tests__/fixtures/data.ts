import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";

const lambdaContext = {
  awsRequestId: "ckhjb7y8g000hjdrk9a3t1yvw",
  callbackWaitsForEmptyEventLoop: true,

  clientContext: {
    client: {
      installationId: "",
      appTitle: "",
      appVersionName: "",
      appVersionCode: "",
      appPackageName: "",
    },

    env: {
      platform: "",
      make: "",
      model: "",
      locale: "",
      platformVersion: "",
    },
  },

  functionName: "serverless-boilerplate-local-app",
  functionVersion: "$LATEST",
  identity: undefined,

  invokedFunctionArn:
    "offline_invokedFunctionArn_for_serverless-boilerplate-local-app",

  logGroupName: "offline_logGroupName_for_serverless-boilerplate-local-app",
  logStreamName: "offline_logStreamName_for_serverless-boilerplate-local-app",
  memoryLimitInMB: "128",
  getRemainingTimeInMillis: () => 8776567,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

const lambdaEvent: APIGatewayProxyEventV2 = {
  body: undefined,

  headers: {
    Host: "0.0.0.0:3000",
    Connection: "keep-alive",
    "Cache-Control": "max-age=0",
    DNT: "1",
    "Upgrade-Insecure-Requests": "1",

    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",

    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",

    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
  },

  isBase64Encoded: false,

  version: "2",
  routeKey: "",
  rawPath: "",
  rawQueryString: "",

  pathParameters: undefined,
  queryStringParameters: undefined,

  requestContext: {
    accountId: "offlineContext_accountId",
    apiId: "offlineContext_apiId",

    authorizer: {
      jwt: { claims: {}, scopes: [] },
    },

    domainName: "offlineContext_domainName",
    domainPrefix: "offlineContext_domainPrefix",

    http: {
      method: "GET",
      path: "/",
      protocol: "HTTP",
      sourceIp: "34.56.4.3",
      userAgent: "",
    },

    requestId: "",
    routeKey: "",

    time: "",
    timeEpoch: 3897,

    stage: "local",
  },

  stageVariables: {
    variable: "any",
  },
};

const lambdaEventV1: APIGatewayProxyEvent = {
  body: null,

  headers: {
    Host: "0.0.0.0:3000",
    Connection: "keep-alive",
    "Cache-Control": "max-age=0",
    DNT: "1",
    "Upgrade-Insecure-Requests": "1",

    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",

    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",

    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
  },

  httpMethod: "GET",
  isBase64Encoded: false,

  multiValueHeaders: {
    Host: ["0.0.0.0:3000"],
    Connection: ["keep-alive"],
    "Cache-Control": ["max-age=0"],
    DNT: ["1"],
    "Upgrade-Insecure-Requests": ["1"],

    "User-Agent": [
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
    ],

    Accept: [
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    ],

    "Accept-Encoding": ["gzip, deflate"],
    "Accept-Language": ["en-US,en;q=0.9,fr;q=0.8"],
  },

  multiValueQueryStringParameters: null,
  path: "",
  pathParameters: null,
  queryStringParameters: null,

  requestContext: {
    accountId: "offlineContext_accountId",
    apiId: "offlineContext_apiId",

    authorizer: {
      claims: undefined,
      scopes: undefined,
      principalId: "offlineContext_authorizer_principalId",
    },

    domainName: "offlineContext_domainName",
    domainPrefix: "offlineContext_domainPrefix",
    extendedRequestId: "ckhjb7y8f000fjdrk5u41betq",
    httpMethod: "GET",

    identity: {
      accessKey: null,
      apiKeyId: null,
      accountId: "offlineContext_accountId",
      apiKey: "offlineContext_apiKey",
      caller: "offlineContext_caller",

      cognitoAuthenticationProvider:
        "offlineContext_cognitoAuthenticationProvider",

      cognitoAuthenticationType: "offlineContext_cognitoAuthenticationType",
      cognitoIdentityId: "offlineContext_cognitoIdentityId",
      cognitoIdentityPoolId: "offlineContext_cognitoIdentityPoolId",
      principalOrgId: null,
      sourceIp: "127.0.0.1",
      user: "offlineContext_user",

      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",

      userArn: "offlineContext_userArn",
    },

    path: "",
    protocol: "HTTP/1.1",
    requestId: "ckhjb7y8g000gjdrk891f9ehl",
    requestTime: "15/Nov/2020:11:04:45 -0500",
    requestTimeEpoch: 1605456285698,
    resourceId: "offlineContext_resourceId",
    resourcePath: "/local",
    stage: "local",
  },

  resource: "/local",

  stageVariables: {
    variable: "any",
  },
};

export { lambdaContext, lambdaEvent, lambdaEventV1 };
