// API Gateway+LambdaやLamdba FunctoinUrlなどの構成

import * as cdk from "aws-cdk-lib"
import { CognitoUserPoolsAuthorizer, Cors, LambdaRestApi } from "aws-cdk-lib/aws-apigateway"
import { UserPool } from "aws-cdk-lib/aws-cognito"
import { TableV2 } from "aws-cdk-lib/aws-dynamodb"
import { Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"

interface ApiProps extends cdk.StackProps {
  userPool: UserPool
  sampleTable: TableV2
}

export class Api extends Construct {
  readonly testLambda: Function
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id)

    const lambdaFunction = new NodejsFunction(this, "SampleLamdba", {
      entry: "src/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_LATEST,
      environment: {
        TABLE_NAME: props.sampleTable.tableName
      }
    })

    props.sampleTable.grantReadWriteData(lambdaFunction)

    const userPoolsAuthorizer = new CognitoUserPoolsAuthorizer(this, "UserPoolsAuthroizer", {
      cognitoUserPools: [props.userPool]
    })

    const restApi = new LambdaRestApi(this, "RestApi", {
      handler: lambdaFunction,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        maxAge: cdk.Duration.minutes(5)
      },
      deployOptions: { stageName: "v1" },
      defaultMethodOptions: { authorizer: userPoolsAuthorizer }
    })
  }
}
