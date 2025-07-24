import * as cdk from "aws-cdk-lib"
import { IpAddresses, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2"
import { Construct } from "constructs"

interface VpcProps extends cdk.StackProps {
  vpcCidr: string,
  maxAzs: number,
  natGateways: number
  subnetConfiguration: {
    name: string,
    cidrMask: number
    subnetType: SubnetType
  }[]
}

export class VpcConstruct extends Construct {
  readonly vpc: Vpc
  constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id)

    const vpc = new Vpc(this, "Vpc", {
      ipAddresses: IpAddresses.cidr(props.vpcCidr),
      maxAzs: props.maxAzs,
      natGateways: props.natGateways,
      subnetConfiguration: props.subnetConfiguration
    })

    this.vpc = vpc
  }
}
