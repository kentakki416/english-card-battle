import * as cdk from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

import { Environment } from '../../parameter'

interface Route53StackProps extends cdk.StackProps {
  environment: Environment
  domainName?: string // ドメイン名をパラメータとして受け取る
}

export class Route53Stack extends cdk.Stack {
  readonly hostedZone: route53.HostedZone

  constructor(scope: Construct, id: string, props: Route53StackProps) {
    super(scope, id, props)

    // ドメイン名の設定（テスト用の一時的なドメイン名）
    const domainName = props.domainName || 'english-card-battle-test.com' // テスト用ドメイン名

    // Hosted Zone
    this.hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: domainName,
    })

    // Export hosted zone information for other stacks
    new cdk.CfnOutput(this, 'HostedZoneId', {
      value: this.hostedZone.hostedZoneId,
      exportName: `${props.environment}-hosted-zone-id`,
    })

    new cdk.CfnOutput(this, 'HostedZoneName', {
      value: this.hostedZone.zoneName,
      exportName: `${props.environment}-hosted-zone-name`,
    })

    // NS Records for delegation (if needed)
    new cdk.CfnOutput(this, 'NameServers', {
      value: cdk.Fn.join(',', this.hostedZone.hostedZoneNameServers || []),
      exportName: `${props.environment}-name-servers`,
    })
  }
}
