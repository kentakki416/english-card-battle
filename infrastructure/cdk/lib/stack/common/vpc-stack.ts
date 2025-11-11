import * as cdk from 'aws-cdk-lib'
import { IpAddresses, Vpc } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

import { Environment, getEnvironmentParameters } from '../../parameter'

interface VpcStackProps extends cdk.StackProps {
  environment: Environment
}

export class VpcStack extends cdk.Stack {
  readonly vpc: Vpc

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props)

    const parameters = getEnvironmentParameters(props.environment)

    // VPCを直接作成（Constructを使用しない）
    this.vpc = new Vpc(this, 'Vpc', {
      vpcName: 'english-card-battle-vpc',
      ipAddresses: IpAddresses.cidr(parameters.vpc.vpcCidr),
      maxAzs: parameters.vpc.maxAzs,
      natGateways: parameters.vpc.natGateways,
      subnetConfiguration: parameters.vpc.subnetConfiguration
    })

    // Export VPC ID for other stacks
    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      exportName: `${props.environment}-vpc-id`,
    })

    new cdk.CfnOutput(this, 'VpcCidr', {
      value: this.vpc.vpcCidrBlock,
      exportName: `${props.environment}-vpc-cidr`,
    })

    // Export subnet information
    new cdk.CfnOutput(this, 'PublicSubnetIds', {
      value: cdk.Fn.join(',', this.vpc.publicSubnets.map((subnet) => subnet.subnetId)),
      exportName: `${props.environment}-public-subnet-ids`,
    })

    new cdk.CfnOutput(this, 'PrivateSubnetIds', {
      value: cdk.Fn.join(',', this.vpc.privateSubnets.map((subnet) => subnet.subnetId)),
      exportName: `${props.environment}-private-subnet-ids`,
    })
  }
}
