import * as cdk from "aws-cdk-lib"
import { Effect, FederatedPrincipal, OpenIdConnectProvider, Policy, PolicyStatement, Role } from "aws-cdk-lib/aws-iam"
import { Construct } from "constructs"


interface GitHubActionsOidcProps {
  githubOwner: string
  githubRepository: string
  /** CDKのクオリファイア（デフォルト: hnb659fds） */
  cdkQualifier?: string
}

export class GitHubActionsOidcConstruct extends Construct {
  private readonly cdkQualifier: string
  private readonly githubOwner: string
  private readonly githubRepository: string
  private readonly awsAccountId: string
  private readonly region: string

  constructor(scope: Construct, id: string, props: GitHubActionsOidcProps) {
    super(scope, id)

    // プロパティの初期化
    this.cdkQualifier = props.cdkQualifier || "hnb659fds"
    this.githubOwner = props.githubOwner
    this.githubRepository = props.githubRepository
    this.awsAccountId = cdk.Stack.of(this).account
    this.region = cdk.Stack.of(this).region

    /**
     * OpenID Connect Providerを作成
     *
     * GitHub Actionsが発行するJWTトークンを検証するための外部IDプロバイダーを設定します。
     * 1つのAWSアカウントにつき1つのOIDCプロバイダーしか作成できません。
     */
    new OpenIdConnectProvider(this, "OpenIdConnectProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"]
    })

    /**
     * GitHub Actions用のIAMロールを作成
     *
     * FederatedPrincipalを使用して、GitHub Actionsからの認証を信頼し、
     * 特定のリポジトリからのアクセスのみを許可します。
     *
     * @returns 作成されたIAMロール
     */
    const githubActionsOidcRole = new Role(this, "GitHubActionsOidcRole", {
      assumedBy: new FederatedPrincipal(
        // 1. GitHubが発行するJWTトークンを信頼（token.actions.githubusercontent.comからの認証を許可）
        `arn:aws:iam::${this.awsAccountId}:oidc-provider/token.actions.githubusercontent.com`,
        // 2. JWTトークンの検証
        {
          // JWTトークンの対象者（Audience）がsts.amazonaws.comであることを確認
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
          // JWTトークンの発行者（Subject）が特定のリポジトリであることを確認
          // :* により、そのリポジトリの任意のブランチやワークフローからのアクセスを許可
          StringLike: {
            "token.actions.githubusercontent.com:sub": `repo:${this.githubOwner}/${this.githubRepository}:*`,
          },
        },
        // 3. 認証方式をsts:AssumeRoleWithWebIdentityに設定
        "sts:AssumeRoleWithWebIdentity",
      ),
    })

    // 出力の設定
    new cdk.CfnOutput(this, "GitHubActionsOidcRoleArnOutput", {
      value: githubActionsOidcRole.roleArn,
      description: "ARN of the IAM role for GitHub Actions OIDC authentication"
    })

    // CDKデプロイ用ポリシーの作成とアタッチ
    const cdkDeployPolicy = new Policy(this, "CdkDeployPolicy", {
      policyName: "CdkDeployPolicy",
      statements: [
        // S3バケット一覧取得権限（CDKがアセットをアップロードするバケットを特定するため）
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:getBucketLocation", "s3:List*"],
          resources: ["arn:aws:s3::*"],
        }),

        // CloudFormation操作権限（CDKがスタックを作成・更新するため）
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "cloudformation:CreateStack",
            "cloudformation:CreateChangeSet",
            "cloudformation:DeleteChangeSet",
            "cloudformation:DescribeChangeSet",
            "cloudformation:DescribeStacks",
            "cloudformation:DescribeStackEvents",
            "cloudformation:ExecuteChangeSet",
            "cloudformation:GetStackPolicy",
            "cloudformation:GetTemplate",
            "cloudformation:ListStacks",
            "cloudformation:UpdateStack",
          ],
          resources: ["*"],
        }),

        // CDKアセット用S3権限（Lambda関数のコード、Dockerイメージなどのアップロード用）
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
          resources: [`arn:aws:s3:::cdk-${this.cdkQualifier}-assets-${this.awsAccountId}-${this.region}/*`],
        }),

        // SSMパラメータ取得権限（CDKブートストラップのバージョン情報取得用）
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["ssm:GetParameter"],
          resources: [
            `arn:aws:ssm:${this.region}:${this.awsAccountId}:parameter/cdk-bootstrap/${this.cdkQualifier}/version`,
          ],
        }),

        // IAMロール引き渡し権限（CloudFormationが他のAWSサービスにロールを引き渡すため）
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["iam:PassRole"],
          resources: [
            `arn:aws:iam::${this.awsAccountId}:role/cdk-${this.cdkQualifier}-cfn-exec-role-${this.awsAccountId}-${this.region}`,
          ],
        }),
      ]
    })
    githubActionsOidcRole.attachInlinePolicy(cdkDeployPolicy)
  }
}
