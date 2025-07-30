import * as cdk from 'aws-cdk-lib'
import { OAuthScope, UserPool } from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'

export class Auth extends Construct {
  readonly userPool: UserPool
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const userPool = new UserPool(this, 'UserPool', {
      signInAliases: {
        email: true
      },
      deletionProtection: true,
      selfSignUpEnabled: true,
    })
    userPool.addDomain('UserPoolDomain', {
      cognitoDomain: {
        domainPrefix: 'dev-mastering-cdk-serverless-app'
      }
    })
    const userPoolClient = userPool.addClient('UserPoolClient', {
      generateSecret: false,
      oAuth: {
        callbackUrls: ['https://example.com'],
        logoutUrls: ['https://example.com'],
        flows: { authorizationCodeGrant: true },
        scopes: [
          OAuthScope.EMAIL,
          OAuthScope.PROFILE,
          OAuthScope.OPENID,
        ]
      },
      authFlows: { adminUserPassword: true }
    })

    this.userPool = userPool

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId
    })

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId
    })
  }

}
