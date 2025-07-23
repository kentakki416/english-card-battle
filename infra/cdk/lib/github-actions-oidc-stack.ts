import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

import { GitHubActionsOidcConstruct } from "./constructs/github-actions-oidc"

export class GitHubActionsOidcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    new GitHubActionsOidcConstruct(this, "GitHubActionsOidc", {
      githubOwner: "kentakki416",
      githubRepository: "english-card-battle"
    })
  }
}
