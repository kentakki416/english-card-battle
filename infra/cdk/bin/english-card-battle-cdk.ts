#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { AwsSolutionsChecks } from "cdk-nag"

import { ApiServerStack } from "../lib/api-server-stack"
import { GitHubActionsOidcStack } from "../lib/github-actions-oidc-stack"
import { Environment } from "../lib/parameter"
import { ServerLessAppStack } from "../lib/serverless-app-stack"

const app = new cdk.App()

// cdk-nagが有効化されいてる場合のみチェックする
if (process.env.NAG_CHECK === "true") {
  cdk.Aspects.of(app).add(new AwsSolutionsChecks())
}

new GitHubActionsOidcStack(app, "GitHubActionsOidc", {})

new ServerLessAppStack(app, "ServerLessApp", {})

new ApiServerStack(app, "ApiServer", {
  environment: process.env.ENVIRONMENT as Environment,
})
