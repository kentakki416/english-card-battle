import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { EcrConstruct } from './constructs/ecr'
import { EcsConstruct } from './constructs/ecs'
import { VpcConstruct } from './constructs/vpc'
import { getEnvironmentParameters, Environment } from './parameter'

interface ApiServerStackProps extends cdk.StackProps {
  environment: Environment;
}

export class ApiServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiServerStackProps) {
    super(scope, id, props)

    // 環境パラメータの取得
    const parameters = getEnvironmentParameters(props.environment)

    // VPC Constructの作成
    const vpcConstruct = new VpcConstruct(this, 'VpcConstruct', {
      vpcCidr: parameters.vpc.vpcCidr,
      maxAzs: parameters.vpc.maxAzs,
      natGateways: parameters.vpc.natGateways,
      subnetConfiguration: parameters.vpc.subnetConfiguration,
    })

    // ECR Constructの作成
    new EcrConstruct(this, 'EcrConstruct', {
      repositoryName: parameters.ecr.repositoryName,
    })

    // ECS Constructの作成
    new EcsConstruct(this, 'EcsConstruct', {
      vpc: vpcConstruct.vpc,
      cpu: parameters.ecs.cpu,
      memoryLimitMiB: parameters.ecs.memoryLimitMiB,
      containerPort: parameters.ecs.containerPort,
      hostPort: parameters.ecs.hostPort,
      desiredCount: parameters.ecs.desiredCount,
      maxHealthyPercent: parameters.ecs.maxHealthyPercent,
      minHealthyPercent: parameters.ecs.minHealthyPercent,
      enableExecuteCommand: parameters.ecs.enableExecuteCommand,
    })
  }
}
