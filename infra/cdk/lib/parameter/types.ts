import { SubnetType } from 'aws-cdk-lib/aws-ec2';

export interface VpcParameters {
  vpcCidr: string;
  maxAzs: number;
  natGateways: number;
  subnetConfiguration: {
    name: string;
    cidrMask: number;
    subnetType: SubnetType;
  }[];
}

export interface EcsParameters {
  cpu: number;
  memoryLimitMiB: number;
  containerPort: number;
  hostPort: number;
  desiredCount: number;
  maxHealthyPercent: number;
  minHealthyPercent: number;
  enableExecuteCommand: boolean;
}

export interface EcrParameters {
  repositoryName: string;
}

export interface EnvironmentParameters {
  vpc: VpcParameters;
  ecs: EcsParameters;
  ecr: EcrParameters;
}

export type Environment = 'dev' | 'stg' | 'prd'; 
