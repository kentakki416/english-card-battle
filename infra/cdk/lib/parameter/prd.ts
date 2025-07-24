import { SubnetType } from "aws-cdk-lib/aws-ec2"

import { EnvironmentParameters } from "./types"

export const prdParameters: EnvironmentParameters = {
  vpc: {
    vpcCidr: "10.102.0.0/16",
    maxAzs: 3,
    natGateways: 3,
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: "Public",
        subnetType: SubnetType.PUBLIC,
      },
      {
        cidrMask: 24,
        name: "Private",
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      },
    ],
  },
  ecs: {
    cpu: 1024,
    memoryLimitMiB: 2048,
    containerPort: 80,
    hostPort: 80,
    desiredCount: 3,
    maxHealthyPercent: 200,
    minHealthyPercent: 50,
    enableExecuteCommand: false,
  },
  ecr: {
    repositoryName: "english-card-battle-api-prd",
  },
}
