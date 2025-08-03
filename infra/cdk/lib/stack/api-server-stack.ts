import * as cdk from 'aws-cdk-lib'
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

import { BaseEcsConstruct } from '../constructs/base-ecs'
import { EcrConstruct } from '../constructs/ecr'
import { Environment, getEnvironmentParameters } from '../parameter'

import { VpcStack } from './common/vpc-stack'

interface ApiServerStackProps extends cdk.StackProps {
  environment: Environment
  vpcStack: VpcStack // VPC Stackへの参照
  route53Stack: route53.HostedZone // Route53 Stackへの参照
}

export class ApiServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiServerStackProps) {
    super(scope, id, props)

    // 環境パラメータの取得
    const parameters = getEnvironmentParameters(props.environment)

    // VPC StackからVPCを参照
    const vpc = props.vpcStack.vpc

    // ECR Constructの作成
    new EcrConstruct(this, 'EcrConstruct', {
      repositoryName: parameters.ecr.repositoryName,
    })

    // API Server ECS Constructの作成（BaseEcsConstructを直接使用）
    const ecsConstruct = new BaseEcsConstruct(this, 'ApiServerEcsConstruct', {
      vpc: vpc,
      cpu: parameters.ecs.cpu,
      memoryLimitMiB: parameters.ecs.memoryLimitMiB,
      containerPort: parameters.ecs.containerPort,
      hostPort: parameters.ecs.hostPort,
      desiredCount: parameters.ecs.desiredCount,
      maxHealthyPercent: parameters.ecs.maxHealthyPercent,
      minHealthyPercent: parameters.ecs.minHealthyPercent,
      enableExecuteCommand: parameters.ecs.enableExecuteCommand,
      serviceName: 'api-server',
      containerName: 'api-server',
      image: cdk.aws_ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'), // 実際のイメージに変更
      logPrefix: 'api-server',
      // API Server固有の追加設定
      additionalTaskRolePolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
      ],
      environmentVariables: {
        NODE_ENV: props.environment,
        API_VERSION: 'v1',
        LOG_LEVEL: 'info',
      },
    })

    // サブドメインのAレコード: api.english-card-battle-test.com
    new route53.ARecord(this, 'ApiARecord', {
      zone: props.route53Stack,
      recordName: 'api', // サブドメイン名
      target: route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.LoadBalancerTarget(ecsConstruct.alb)
      )
    })

    // ルートドメインのAレコード: english-card-battle-test.com
    new route53.ARecord(this, 'RootARecord', {
      zone: props.route53Stack,
      recordName: '', // 空文字 = ルートドメイン
      target: route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.LoadBalancerTarget(ecsConstruct.alb)
      )
    })
  }
}
