import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { EnvironmentParameters } from './types';

export const stgParameters: EnvironmentParameters = {
  vpc: {
    vpcCidr: '10.101.0.0/16',
    maxAzs: 3,
    natGateways: 1,
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: 'Public',
        subnetType: SubnetType.PUBLIC,
      },
      {
        cidrMask: 24,
        name: 'Private',
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      },
    ],
  },
  ecs: {
    cpu: 512,
    memoryLimitMiB: 1024,
    containerPort: 80,
    hostPort: 80,
    desiredCount: 2,
    maxHealthyPercent: 200,
    minHealthyPercent: 50,
    enableExecuteCommand: true,
  },
  ecr: {
    repositoryName: 'english-card-battle-api-stg',
  },
}; 
