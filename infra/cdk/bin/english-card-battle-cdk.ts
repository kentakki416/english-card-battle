#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { AwsSolutionsChecks } from 'cdk-nag'

import { Environment } from '../lib/parameter'
import { ApiServerStack } from '../lib/stack/api-server-stack'
import { GitHubActionsOidcStack } from '../lib/stack/common/github-actions-oidc-stack'
import { Route53Stack } from '../lib/stack/common/route53-stack'
import { VpcStack } from '../lib/stack/common/vpc-stack'
import { SimpleApiServerStack } from '../lib/stack/sample'
import { ServerLessAppStack } from '../lib/stack/serverless-app-stack'

const app = new cdk.App()

// cdk-nagが有効化されいてる場合のみチェックする
if (process.env.NAG_CHECK === 'true') {
  cdk.Aspects.of(app).add(new AwsSolutionsChecks())
}

new GitHubActionsOidcStack(app, 'GitHubActionsOidc', {})

new ServerLessAppStack(app, 'ServerLessApp', {})

/**
 * VPC Stack（最初にデプロイ）
 */
const vpcStack = new VpcStack(app, 'Vpc', {
  environment: process.env.ENVIRONMENT as Environment,
})

/**
 * Route53 Stack
 */
const route53Stack = new Route53Stack(app, 'Route53', {
  environment: process.env.ENVIRONMENT as Environment,
})

/**
 * ApiServer Stack（VPC Stackを参照）
 */
new ApiServerStack(app, 'ApiServer', {
  environment: process.env.ENVIRONMENT as Environment,
  vpcStack: vpcStack,
  route53Stack: route53Stack.hostedZone,
})

new SimpleApiServerStack(app, 'SimpleApiServer', {})
