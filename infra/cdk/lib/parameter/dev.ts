import { SubnetType } from "aws-cdk-lib/aws-ec2"

import { EnvironmentParameters } from "./types"

export const devParameters: EnvironmentParameters = {
  vpc: {
    vpcCidr: "10.100.0.0/16",
    maxAzs: 2,
    natGateways: 1,
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
    cpu: 256,
    memoryLimitMiB: 512,
    containerPort: 80,
    hostPort: 80,
    desiredCount: 1,
    maxHealthyPercent: 200,
    minHealthyPercent: 50,
    enableExecuteCommand: true,
  },
  ecr: {
    repositoryName: "english-card-battle-api-dev",
  },
}
